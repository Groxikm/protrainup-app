<template>
  <div>
    <div class="search-panel">
      <h2>Open User Card by:</h2>
      <form>
        <input v-model="query.name" placeholder="Name" />
        <input v-model="query.surname" placeholder="Surname" />
        <button @click.prevent="FindAndShowUser" type="submit" class="search-button">Find and Show User</button>
        <div v-if="searchUserErrorMessage" class="error-message">{{ searchUserErrorMessage }}</div>
      </form>
    </div>

    <div class="user-table-container">
      <table class="user-table">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Surname</th>
          <th>Login</th>
          <th>Visits</th>
          <th>Club</th>
          <th>Attendance</th>
          <th>Unpaid months</th>
          <th>Avatar</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in users" :key="user.id" :class="{ 'editing-row': user.isEditing }">
          <td>{{ index + 1 }}</td>
          <td>
            <div v-if="!user.isEditing">{{ user.name }}</div>
            <div v-if="user.isEditing"><input v-model="editingUser.name" placeholder="Name"/></div>
          </td>
          <td>
            <div v-if="!user.isEditing">{{ user.surname }}</div>
            <div v-if="user.isEditing"><input v-model="editingUser.surname" placeholder="Surname"/></div>
          </td>
          <td>{{ user.login }}</td>
          <td>
            <div v-if="!user.isEditing">{{ user.visit_frequency }}</div>
            <div v-if="user.isEditing"><input v-model="editingUser.visit_frequency" placeholder="Visits" type="number"/></div>
          </td>
          <td>{{ user.club }}</td>
          <td>{{ attendanceCalculation(user.visit_frequency) }}</td>
          <td>
            <div v-if="!user.isEditing">{{ user.backlog }}</div>
            <div v-if="user.isEditing"><input v-model="editingUser.backlog" placeholder="Unpaid months" type="number"/></div>
          </td>
          <td>
            <img v-if="!user.isEditing" :src="formatAvatar(user.avatar_link)" alt="Avatar" width="32" height="32">
            <div v-if="user.isEditing"><input v-model="editingUser.avatar_link" placeholder="Avatar URL"/></div>
            <img :src="formatClub(user.club_link)" alt="Club" width="32" height="32">
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
import {findRules, findUserByNameSurname, findUsers, checkValidity} from "../api/adminGETService.js";
import {changeUserData} from "../api/adminPUTService.js";

const user_arr = [];
export default {
  data() {
    return {
      query: {
        id: "",
        name: "",
        surname: ""
      },
      calc_rules: {},
      users: [],
      editingUser: null,
      currentlyEditingIndex: null,
      lastUserDate: null,
      limit: 10,
      searchUserErrorMessage: "",
      errorMessage: "",
    };
  },
  async mounted() {
    console.log(this.users, "THIS USERS");
    await this.loadMoreUsers();
    await this.getRules();
  },
  methods: {
    async FindAndShowUser() {
      try {
        this.searchUserErrorMessage = "";

        if (!this.query.name || !this.query.surname) {
          this.searchUserErrorMessage = "Please enter both name and surname";
          return;
        }

        const token = localStorage.getItem('acc_token');
        if (!token) {
          this.searchUserErrorMessage = "Missing authentication token";
          return;
        }

        const searchedUser = await findUserByNameSurname(this.query.name, this.query.surname);
        console.log("API Response:", searchedUser);

        // Adjust this based on actual API response
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
        this.users[index].isEditing = true;
        this.currentlyEditingIndex = index;

        // Create a copy of the user data for editing
        this.editingUser = { ...user };
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

        this.currentlyEditingIndex = null;
        this.editingUser = null;
      } catch (error) {
        this.errorMessage = error.message || "Error saving user changes";
      }
    },
    async getRules() {
      try {
        const data = await findRules();
        this.calc_rules = data;

      } catch (error) {

      }

    },
    attendanceCalculation(visits){
      try {
        return Math.floor((parseFloat(visits) * 100) / parseFloat(this.calc_rules.days_scope));
      } catch (e) {
        return null;
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