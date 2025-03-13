<template>
    <div>
      <h2>Manage Users</h2>
      <button @click="currentComponent = 'CreateUser'">Create User</button>
      <button @click="currentComponent = 'FindUser'">User Panel</button>
      <button @click="currentComponent = 'UsersList'">Users List</button>
      <button @click="currentComponent = 'ScanPage'">Scan User QR</button>
      <button @click="currentComponent = 'StatusConditionEdit'">Rules edit</button>
    </div>

    <component :is="currentComponent" @id-scanned="handleIdScanned" @switch-component="switchComponent" @change-stored-userId="handleUserIdChange"/>
</template>

<script>
// import axios from 'axios'; // usable for sharing data between components
import CreateUser from './CreateUser.vue';
import FindUser from './FindUser.vue';
import UsersList from './UsersList.vue';
import ScanPage from './ScanPage.vue';
import StatusConditionEdit from './StatusConditionEdit.vue';

import {addRegAttempt, addRegAttemptGreen} from "../api/adminPOSTService.js";

export default {
  components: {
    CreateUser,
    FindUser,
    UsersList,
    ScanPage,
    StatusConditionEdit,
  },
  data() {
    return {
      userId: '',
      attempts: [],
      latestDateId: null,
      hasMore: true,
      currentComponent: 'UsersList'
    };
  },
  methods: {
    handleIdScanned(scannedId) {
      this.userId = scannedId;
      console.log("Scanned ID received:", this.userId);
      localStorage.setItem("last_scanned_id", this.userId);
      const userDataJson = {
        "id": this.userId,
        "location": "Wroclaw"
      }
      addRegAttemptGreen(userDataJson);
      this.currentComponent = FindUser;
    },

    handleUserIdChange(userId) {
      this.userId = userId;
      console.log("User ID changed:", this.userId);
      localStorage.setItem("last_scanned_id", this.userId);
    },

    switchComponent(componentName) {
      if (componentName) {
        this.currentComponent = componentName;
      } else {
        console.error(`Component ${componentName} not found`);
      }
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

  position: relative;
  margin: 3px 3px;
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