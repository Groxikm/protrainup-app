<template>
  <div class="admin-panel">
    <header class="admin-header">
      <h1>Manage Users</h1>
      <button @click="logout" class="logout-button">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </header>

    <nav class="admin-nav">
      <ul class="nav-list">
        <li>
          <button @click="currentComponent = 'CreateUser'" :class="{ 'active': currentComponent === 'CreateUser' }">
            <i class="fas fa-user-plus"></i> Create User
          </button>
        </li>
        <li>
          <button @click="currentComponent = 'FindUser'" :class="{ 'active': currentComponent === 'FindUser' }">
            <i class="fas fa-user"></i> User Panel
          </button>
        </li>
        <li>
          <button @click="currentComponent = 'UsersList'" :class="{ 'active': currentComponent === 'UsersList' }">
            <i class="fas fa-list"></i> Users List
          </button>
        </li>
        <li>
          <button @click="currentComponent = 'UserAttemptsTable'" :class="{ 'active': currentComponent === 'UserAttemptsTable' }">
            <i class="fas fa-list"></i> Registration List
          </button>
        </li>
        <li>
          <button @click="currentComponent = 'ScanPage'" :class="{ 'active': currentComponent === 'ScanPage' }">
            <i class="fas fa-qrcode"></i> Scan User QR
          </button>
        </li>
        <li>
          <button @click="currentComponent = 'StatusConditionEdit'" :class="{ 'active': currentComponent === 'StatusConditionEdit' }">
            <i class="fas fa-cogs"></i> Rules Edit
          </button>
        </li>
      </ul>
    </nav>

    <main class="admin-content">
      <component
          :is="currentComponent"
          @id-scanned="handleIdScanned"
          @switch-component="switchComponent"
          @change-stored-userId="handleUserIdChange"
      />
    </main>

    <footer class="admin-footer">
      <p>&copy; 2025 User Management System</p>
    </footer>
  </div>
</template>

<script>
// import axios from 'axios'; // usable for sharing data between components
import CreateUser from './CreateUser.vue';
import FindUser from './FindUser.vue';
import UsersList from './UsersList.vue';
import ScanPage from './ScanPage.vue';
import UserAttemptsTable from './UserAttemptsTable.vue';
import StatusConditionEdit from './StatusConditionEdit.vue';

import { addRegAttempt, addRegAttemptGreen } from "../api/adminPOSTService.js";

export default {
  components: {
    CreateUser,
    FindUser,
    UsersList,
    ScanPage,
    UserAttemptsTable,
    StatusConditionEdit,
  },
  data() {
    return {
      userId: '',
      attempts:[],
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
    },

    logout() {
      console.log('Logging out...');
      localStorage.removeItem('acc_token');
      this.$router.push('/'); // Redirect to the login page
    },
  },
};
</script>

<style scoped>
/* Base styles for the admin panel layout */
.admin-panel {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f6f8; /* Light background */
  color: #333;
}

/* Header styling */
.admin-header {
  background-color: #2c3e50; /* Dark header background */
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between; /* Space out title and logout button */
  align-items: center;
}

.admin-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

/* Logout button styling */
.logout-button {
  background-color: #d32f2f; /* Red color for logout */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.logout-button:hover {
  background-color: #b71c1c; /* Darker red on hover */
}

/* Navigation bar styling */
.admin-nav {
  background-color: #34495e; /* Darker navigation background */
  color: white;
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 15px;
  justify-content: flex-start; /* Align buttons to the left */
}

.nav-list li {
  margin: 0;
}

.admin-nav button {
  background-color: transparent;
  color: #ecf0f1; /* Light text for buttons */
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-nav button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.admin-nav button.active {
  background-color: #18bc9c; /* Highlight for the active button */
  color: white;
}

/* Main content area */
.admin-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #fff; /* White content background */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  margin: 20px;
  border-radius: 8px;
}

/* Footer styling */
.admin-footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 10px;
  font-size: 14px;
}

/* Icon styling (requires Font Awesome or similar) */
.fas {
  margin-right: 5px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: center;
  }

  .logout-button {
    margin-top: 10px;
  }

  .admin-nav {
    padding: 10px;
  }

  .nav-list {
    flex-direction: column;
    gap: 10px;
  }

  .admin-nav button {
    width: 100%;
  }

  .admin-content {
    margin: 10px;
    padding: 15px;
  }
}
</style>