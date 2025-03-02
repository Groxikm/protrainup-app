<template>
    <div>
      <h2>Manage Users</h2>
      <button @click="currentComponent = 'CreateUser'">Create User</button>
      <button @click="currentComponent = 'FindUser'">Find User</button>
      <button @click="currentComponent = 'ChangeUser'">Update User</button>
      <button @click="currentComponent = 'DeleteUser'">Delete User</button>
      <button @click="currentComponent = 'ScanPage'">Scan User QR</button>
      <button @click="currentComponent = 'RegistrationLogPage'">Registration Log</button>
    </div>

    <component :is="currentComponent"/>
</template>

<script>
import axios from 'axios';
import CreateUser from './CreateUser.vue';
import FindUser from './FindUser.vue';
import ChangeUser from './ChangeUser.vue';
import DeleteUser from './DeleteUser.vue';
import ScanPage from './ScanPage.vue';
import RegistrationLogPage from "./RegistrationLogPage.vue";

export default {
  components: {
    CreateUser,
    FindUser,
    ChangeUser,
    DeleteUser,
    ScanPage,
    RegistrationLogPage
  },
  data() {
    return {
      userId: '',
      attempts: [],
      latestDateId: null,
      hasMore: true,
      currentComponent: 'CreateUser'
    };
  },
  methods: {
    async fetchAttempts() {
      if (!this.userId) return;
      try {
        const response = await axios.get(`/api/user-attempts`, {
          params: {user_id: this.userId, latest_date_id: this.latestDateId}
        });
        if (response.data.length < 10) {
          this.hasMore = false;
        }
        if (response.data.length > 0) {
          this.latestDateId = response.data[response.data.length - 1].id;
          this.attempts.push(...response.data);
        }
      } catch (error) {
        console.error("Error fetching attempts:", error);
      }
    },
    loadMore() {
      this.fetchAttempts();
    },
    resetData() {
      this.attempts = [];
      this.latestDateId = null;
      this.hasMore = true;
      this.fetchAttempts();
    }
  }
};
</script>

<style scoped>
/* Container for the entire component */
div {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Heading */
h2 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

/* Button container */
.button-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
}

/* General button styling */
button {
  background-color: #3498db; /* Blue */
  border: none;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Hover effect for buttons */
button:hover {
  background-color: #2980b9; /* Darker blue */
  transform: translateY(-2px);
}

/* Active effect for buttons */
button:active {
  transform: translateY(0);
}

/* Specific button colors for differentiation */
button:nth-child(1) {
  background-color: #27ae60; /* Green for Create User */
}

button:nth-child(2) {
  background-color: #e67e22; /* Orange for Find User */
}

button:nth-child(3) {
  background-color: #9b59b6; /* Purple for Update User */
}

button:nth-child(4) {
  background-color: #e74c3c; /* Red for Delete User */
}

button:nth-child(5) {
  background-color: #1abc9c; /* Teal for Scan User QR */
}

button:nth-child(6) {
  background-color: #34495e; /* Dark blue for Registration Log */
}

/* Responsive design for smaller screens */
@media (max-width: 768px) {
  .button-container {
    flex-direction: column;
    align-items: center;
  }

  button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>