<template>
  <div>
    <div class="search-panel">
      <h2>Open User Card by:</h2>
      <form>
        <input
            v-model="searchQuery"
            @input="filterUsers"
            placeholder="Search (club, team, name, surname, login)"
            class="search-input"
        />
        <button @click.prevent="searchAndShowUser" type="submit" class="search-button">Find and Show User</button>
        <div v-if="searchUserErrorMessage" class="error-message">{{ searchUserErrorMessage }}</div>
      </form>
    </div>

    <div class="user-table-container">
      <table class="user-table">
        <thead>
        <tr>
          <th>#</th>
          <th>Avatar</th>
          <th>Name</th>
          <th>Surname</th>
          <th>Login</th>
          <th>Team</th>
          <th>Club</th>
          <th>Attendance</th>
          <th>Unpaid months</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="user.id" :class="{ 'editing-row': user.isEditing }">
          <td>{{ index + 1 }}</td>
          <td>
            <img v-if="!user.isEditing" :src="formatAvatar(user.avatar_link)" alt="Avatar" width="32" height="32">
            <div v-if="user.isEditing"><input v-model="editingUser.avatar_link" placeholder="Avatar URL"/></div>
            <img v-if="!user.isEditing" :src="formatClub(user.club_link)" alt="Club" width="32" height="32">
          </td>
          <td>
            <div v-if="!user.isEditing">{{ user.name }}</div>
            <div v-if="user.isEditing"><input v-model="editingUser.name" placeholder="Name"/></div>
          </td>
          <td>
            <div v-if="!user.isEditing">{{ user.surname }}</div>
            <div v-if="user.isEditing"><input v-model="editingUser.surname" placeholder="Surname"/></div>
          </td>
          <td>{{ user.login }}</td>
          <td>{{ user.team }}</td>
          <td>{{ user.club }}</td>
          <td>
            <div v-if="!user.isEditing">{{ user.visit_frequency }} %</div>
            <div v-if="user.isEditing"><input v-model="editingUser.visit_frequency" placeholder="Visits" type="number"/></div>
          </td>
          <td>
            <div v-if="!user.isEditing">{{ user.backlog }}</div>
            <div v-if="user.isEditing"><input v-model="editingUser.backlog" placeholder="Unpaid months" type="number"/></div>
          </td>
          <td>
            <button
                @click="handleEditButton(user, index)"
                :class="{ 'edit-button': !user.isEditing, 'confirm-button': user.isEditing }">
              {{ user.isEditing ? 'Confirm' : 'Edit' }}
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="pagination-controls">
        <button @click="loadMoreUsers" class="load-more-button">Load More</button>
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import {findUserById, findUsers} from "../api/adminGETService.js";
import {changeUserData} from "../api/adminPUTService.js";

const user_arr = [];
export default {
  data() {
    return {
      searchQuery: "",
      query: {
        id: "",
        name: "",
        surname: ""
      },
      userId_for_search:'',
      calc_rules: {},
      users: [],
      filteredUsers: [],
      editingUser: null,
      currentlyEditingIndex: null,
      lastUserDate: null,
      limit: 10,
      searchUserErrorMessage: "",
      errorMessage: "",
    };
  },
  async mounted() {
    await this.loadMoreUsers();
    await this.getRules();
  },
  methods: {
    // Format string for name/surname (first letter uppercase, rest lowercase)
    formatNameString(str) {
      if (!str) return "";
      str = str.trim();
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Filter users based on search query
    filterUsers() {
      const query = this.searchQuery.trim().toLowerCase();

      if (!query) {
        this.filteredUsers = [...this.users];
        return;
      }

      this.filteredUsers = this.users.filter(user => {
        // Search priority: club, team, name, surname, login
        return (
            (user.club && user.club.toLowerCase().includes(query)) ||
            (user.team && user.team.toLowerCase().includes(query)) ||
            (user.name && user.name.toLowerCase().includes(query)) ||
            (user.surname && user.surname.toLowerCase().includes(query)) ||
            (user.login && user.login.toLowerCase().includes(query)) ||
            // Check other fields if needed
            (user.backlog && user.backlog.toString().includes(query)) ||
            (user.visit_frequency && user.visit_frequency.toString().includes(query))
        );
      });
    },

    // Search for a specific user on button click
    async searchAndShowUser() {
      try {
        this.searchUserErrorMessage = "";
        const query = this.searchQuery.trim();

        if (!query) {
          this.searchUserErrorMessage = "Please enter a search term";
          return;
        }

        // Format name/surname for searching
        const formattedQuery = this.formatNameString(query);

        // First try to find by login (exact match, no formatting)
        let foundUser = this.users.find(user =>
            user.login && user.login.toLowerCase() === query.toLowerCase()
        );

        // If not found by login, try by name or surname (with formatting)
        if (!foundUser) {
          foundUser = this.users.find(user =>
              (user.name && this.formatNameString(user.name) === formattedQuery) ||
              (user.surname && this.formatNameString(user.surname) === formattedQuery)
          );
        }

        // If still not found, try by full name (with formatting)
        if (!foundUser) {
          // Split query by space to check for "Name Surname" format
          const parts = query.split(' ');
          if (parts.length >= 2) {
            const formattedFirstName = this.formatNameString(parts[0]);
            const formattedLastName = this.formatNameString(parts[1]);

            foundUser = this.users.find(user =>
                user.name && user.surname &&
                this.formatNameString(user.name) === formattedFirstName &&
                this.formatNameString(user.surname) === formattedLastName
            );
          }
        }

        if (foundUser) {
          // Call the FindAndShowUser function with the found user's ID
          await this.FindAndShowUser(foundUser.id);
        } else {
          this.searchUserErrorMessage = "User not found";
        }
      } catch (error) {
        console.error("Error searching for user:", error);
        this.searchUserErrorMessage = error.message || "Error finding user";
      }
    },

    async FindAndShowUser(userId) {
      try {
        this.searchUserErrorMessage = "";

        if (!userId) {
          this.searchUserErrorMessage = "User ID is required";
          return;
        }

        const searchedUser = await findUserById(userId);
        console.log("API Response:", searchedUser);

        const searchedUserId = searchedUser.id || (searchedUser.data && searchedUser.data.id);

        if (searchedUserId) {
          this.$emit('change-stored-userId', searchedUserId);
          this.$emit('switch-component', 'FindUser');
        } else {
          this.searchUserErrorMessage = "User not found";
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        this.searchUserErrorMessage = error.message || "Error finding user";
      }
    },

    async loadMoreUsers() {
      try {
        const data = await findUsers(this.lastUserDate);
        this.lastUserDate = data.last_date;

        // Initialize all users with isEditing property set to false
        const formattedUsers = data.users.map(user => ({
          ...user,
          isEditing: false
        }));

        this.users.push(...formattedUsers);
        this.filteredUsers = [...this.users]; // Initialize filtered users with all users
        user_arr.push(...data.users);
        console.log(data, this.users, "user arr", user_arr);
      } catch (error) {
        console.error('Error fetching users:', error);
        this.errorMessage = "No more users exist";
      }
    },

    formatAvatar(avatarLink) {
      return avatarLink && typeof avatarLink === 'string' ? avatarLink : 'https://via.placeholderA.com/32';
    },

    formatClub(clubLink) {
      return clubLink && typeof clubLink === 'string' ? clubLink : 'https://via.placeholderB.com/32';
    },

    handleEditButton(user, index) {
      // If this user is already in edit mode, save the changes
      if (user.isEditing) {
        this.saveUserChanges();
      } else {
        // Cancel editing for any other user
        this.cancelAllEditing();

        // Set the current user to edit mode
        const actualIndex = this.users.findIndex(u => u.id === user.id);
        if (actualIndex !== -1) {
          this.users[actualIndex].isEditing = true;
          this.currentlyEditingIndex = actualIndex;

          // Create a copy of the user data for editing
          this.editingUser = { ...this.users[actualIndex] };
        }
      }
    },

    cancelAllEditing() {
      this.users.forEach(user => {
        user.isEditing = false;
      });
      this.currentlyEditingIndex = null;
      this.editingUser = null;
    },

    async saveUserChanges() {
      if (!this.editingUser || this.currentlyEditingIndex === null) return;

      try {
        const userDataJson = {
          "id": this.editingUser.id,
          "name": this.editingUser.name,
          "surname": this.editingUser.surname,
          "avatar_link": this.editingUser.avatar_link,
          "visit_frequency": this.editingUser.visit_frequency,
          "backlog": this.editingUser.backlog
        };

        await changeUserData(userDataJson);

        // Update the users array with the edited data
        Object.assign(this.users[this.currentlyEditingIndex], this.editingUser);
        this.users[this.currentlyEditingIndex].isEditing = false;

        // Update filtered users to reflect changes
        this.filterUsers();

        this.currentlyEditingIndex = null;
        this.editingUser = null;
      } catch (error) {
        this.errorMessage = error.message || "Error saving user changes";
      }
    },

    // Add the missing getRules method to prevent errors
    async getRules() {
      // Implementation would depend on what this method is supposed to do
      // For now, adding an empty placeholder to prevent errors
      try {
        // Add implementation if needed
      } catch (error) {
        console.error('Error fetching rules:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Search panel styles */
.search-panel {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

.search-panel h2 {
  margin-top: 0;
  color: #333;
  padding-bottom: 10px;
}

.search-panel form {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-panel input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
}

.search-input {
  min-width: 300px;
}

.search-button {
  background-color: #2196f3;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #0b7dda;
}

/* User table styles */
.user-table-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.user-table {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.user-table th {
  background-color: #f4f4f4;
  font-weight: 600;
}

.user-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.user-table tr:hover {
  background-color: #f1f1f1;
}

.editing-row {
  background-color: #e8f4fe !important;
}

/* Button styles */
.edit-button {
  background-color: #2196f3;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button:hover {
  background-color: #0b7dda;
}

.confirm-button {
  background-color: #9c27b0;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.confirm-button:hover {
  background-color: #7b1fa2;
}

/* Input field styles */
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Pagination controls */
.pagination-controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.load-more-button {
  background-color: #2196f3;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.load-more-button:hover {
  background-color: #0b7dda;
}

/* Error message */
.error-message {
  color: #f44336;
  margin-top: 10px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
  text-align: center;
}
</style>