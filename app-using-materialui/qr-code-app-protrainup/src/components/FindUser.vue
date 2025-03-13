<template>
  <div class="container">
    <div
        v-if="user"
        :class="['user-card', statusClass]"
    >
      <div class="user-details">
        <h3>{{ user.name }} {{ user.surname }}</h3>
        <p><strong>Team:</strong> {{ user.team }}</p>
        <p><strong>Login:</strong> {{ user.login }}</p>
        <p><strong>Club:</strong> {{ user.club }}</p>
        <p><strong>Attendance:</strong> {{ user.attendance }} %</p>
        <p><strong>Number of unpaid months:</strong> {{ user.backlog }} </p>
      </div>
      <div class="avatar-container">
        <img :src="user.avatar_link" alt="User Avatar" class="avatar" />
        <img v-if="user.club_link" :src="user.club_link" alt="Club Image" class="club" />
      </div>

      <button class="delete-button" @click="deleteUser">Delete</button>
      <button class="edit-button" @click="toggleEdit">Edit</button>

      <div v-if="editing" class="edit-form">
        <input v-model="editData.name" placeholder="New Name" />
        <input v-model="editData.surname" placeholder="New Surname" />
        <input v-model="editData.avatar_link" placeholder="New Avatar" />
        <button @click="updateUser">Save</button>
      </div>
    </div>

    <!-- "Pass" Button -->
    <button v-if="showPassButton" class="pass-button" @click="handlePass">Pass</button>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <!-- Registration Attempts Table -->
    <div class="reg-attempts-container">
      <h3>Registration Attempts</h3>
      <table v-if="regAttempts.length > 0" class="reg-attempts-table">
        <thead>
        <tr>
          <th>Date</th>
          <th>Location</th>
          <th>Status</th>
          <th>Role</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="attempt in regAttempts" :key="attempt.id">
          <td>{{ attempt.date }}</td>
          <td>{{ attempt.location }}</td>
          <td :class="'status-' + attempt.status.toLowerCase()">{{ attempt.status }}</td>
          <td>{{ attempt.role }}</td>
        </tr>
        </tbody>
      </table>
      <div v-else class="no-data-message">No registration attempts found.</div>

      <!-- Pagination Controls -->
      <div class="pagination-controls">
        <button
            @click="loadMoreAttempts"
            :disabled="loadingMore || !hasMoreAttempts"
            class="load-more-button"
        >
          {{ loadingMore ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { findUserById, checkValidity, findUserRegAttempts } from "../api/adminGETService.js";
import { changeUserData, deleteUser } from "../api/adminPUTService.js";
import { addRegAttempt} from "../api/adminPOSTService.js";

export default {
  data() {
    return {
      userId: "",
      validity: false,
      status: "Red",
      user: null,
      errorMessage: "",
      editing: false,
      editData: {
        name: "",
        surname: "",
        avatar_link: "",
      },
      // Registration attempts data
      regAttempts: [],
      latestDate: null,
      loadingMore: false,
      hasMoreAttempts: true
    };
  },
  computed: {
    statusClass() {
      switch (this.status) {
        case 'Green':
          return 'status-green';
        case 'Orange b':
          return 'status-orange-back';
        case 'Orange f':
          return 'status-orange-front';
        case 'Red':
        default:
          return 'status-red';
      }
    },
    showPassButton() {
      if (this.userId)
        return this.status === 'Red' || this.status === 'Orange b' || this.status === 'Orange f';
      else
        return false
    }
  },


  async mounted() {
    this.userId = localStorage.getItem("last_scanned_id");
    if (this.userId !== null) {
      await this.getUserById(this.userId);
      await this.getValidityStatus(this.userId);
      await this.getRegAttempts();
    } else this.errorMessage = "No user ID found.";
  },


  methods: {
    // Search and load functionality
    async getUserById() {
      try {
        this.user = await findUserById(this.userId);
      } catch (error) {
        this.user = null;
        this.errorMessage = error.message || "Error finding user";
      }
    },

    async getValidityStatus(userId) {
      try {
        const data = await checkValidity(userId);
        this.status = data.status;
        this.validity = data.status === "Green";
      } catch (error) {
        this.validity = false;
        this.errorMessage = error.message || "Error checking validity";
      }
    },

    // Editing functionality
    toggleEdit() {
      this.editing = !this.editing;
      if (this.user) {
        this.editData = { ...this.user };
      }
    },

    // Pass button functionality
    handlePass() {
      const userDataJson = {
        "id": this.userId,
        "location": "Wroclaw"
      }
      try {
        addRegAttempt(userDataJson);
        this.latestDate = null;
        this.getRegAttempts();
      }
      catch(error) {
        this.validity = false;
        this.errorMessage = error.message || "Error checking validity";
      }
      console.log('Pass button clicked');
    },

    // This method handles three input field name, surname, avatar link to run changes in a single click
    async updateUser() {
      try {
        const userDataJSON = {
          id: this.userId,
          name: this.editData.name,
          surname: this.editData.surname,
          avatar_link: this.editData.avatar_link,
        }
        await changeUserData(userDataJSON);
        this.editing = false; // closing editing section
      } catch (error) {
        this.errorMessage = error.message || "Error updating data";
      }
    },

    async deleteUser() {
      try {
        await deleteUser(this.user.id);
        this.user = null;
      } catch (error) {
        this.errorMessage = error.message || "Error deleting user";
      }
    },

    // Registration attempts functionality
    async getRegAttempts() {
      try {
        this.loadingMore = true;
        const data = await findUserRegAttempts(this.userId, this.latestDate || '');

        if (this.latestDate) {
          this.regAttempts = [...this.regAttempts, ...data.attempts];
        } else {
          this.regAttempts = data.attempts;
        }

        this.latestDate = data.latestDate;
        this.hasMoreAttempts = true;//data.attempts.length === 20;
      } catch (error) {
        this.errorMessage = error.message || "Error loading registration attempts";
      } finally {
        this.loadingMore = false;
      }
    },

    async loadMoreAttempts() {
      if (this.latestDate) {
        await this.getRegAttempts();
      }
    }
  }
};
</script>

<style scoped>
/* Styles for the "Pass" button */
.pass-button {
  display: block;
  width: 100px;
  height: 100px;
  background-color: #ff5722;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 50%;
  margin: 20px auto;
  cursor: pointer;
  text-align: center;
  line-height: 100px;
  transition: background-color 0.3s ease;
}

.pass-button:hover {
  background-color: #e64a19;
}

/* Styles for user card with dynamic shadow based on status */
.status-green {
  box-shadow: 0 0 15px rgba(168, 224, 99, 0.5), 0 0 30px rgba(86, 171, 47, 0.3);
}

.status-red {
  box-shadow: 0 0 15px rgba(255, 69, 69, 0.5), 0 0 30px rgba(139, 0, 0, 0.3);
}

.status-orange-back {
  box-shadow: 0 0 15px rgba(255, 165, 0, 0.5), 0 0 30px rgba(255, 99, 71, 0.3);
}

.status-orange-front {
  box-shadow: 0 0 15px rgba(255, 165, 0, 0.5), 0 0 30px rgba(255, 140, 0, 0.3);
}

/* User card base style */
.user-card {
  position: relative;
  padding: 20px;
  border-radius: 8px;
  background: white; /* Maintain white background for content clarity */
  margin: 10px 0;
  transition: box-shadow 0.3s ease-in-out;
}

/* Button styles */
button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.edit-button {
  background-color: #2196f3;
  color: white;
  position: relative;
}

.edit-button:hover {
  background-color: #1976d2;
  transform: translateY(-2px);
}

.delete-button {
  background-color: #d32f2f;
  color: white;
  position: absolute;
  right: 10px;
}

.delete-button:hover {
  background-color: #b71c1c;
  transform: translateY(-2px);
}

/* Avatar container styles */
.avatar-container {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px; /* Space between avatar and club image */
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
}

.club {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

/* Registration attempts section */
.reg-attempts-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  margin-top: 20px;
}

.reg-attempts-container h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.reg-attempts-table {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;
}

.reg-attempts-table th,
.reg-attempts-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.reg-attempts-table th {
  background-color: #f4f4f4;
  font-weight: 600;
}

.reg-attempts-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.reg-attempts-table tr:hover {
  background-color: #f1f1f1;
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
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.load-more-button:hover:not(:disabled) {
  background-color: #0b7dda;
}

.load-more-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.no-data-message {
  text-align: center;
  padding: 20px;
  color: #757575;
}
</style>