<template>
  <div class="admin-panel">
    <header class="admin-header">
      <h1>Welcome</h1>
      <span>{{ clock }}</span><button @click="logout" class="logout-button">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </header>

    <main class="admin-content welcome-page-content">
      <div class="welcome-page container">
        <div class="header">
          <h2>Welcome, {{ user.name }} {{ user.surname }}!</h2>
        </div>

        <div class="qr-code-container">
          <h3>Your ID as QR Code:</h3>
          <qrcode-vue :value="user.id" :size="250" level="M" />
        </div>

        <button @click="toggleStatus" class="status-button">
          <i class="fas fa-info-circle"></i> View Status
        </button>

        <div v-if="showStatus" class="status-container" :class="statusClass">
          <strong v-if="!loadingStatus">Status: </strong>
          <span v-if="!loadingStatus">{{ statusMessage }}</span>
          <span v-else class="loading-indicator">Loading status...</span>
        </div>
      </div>
    </main>

    <footer class="admin-footer">
      <p>&copy; 2025 User Management System</p>
    </footer>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import { checkValidity } from "../api/adminGETService.js";

export default {
  name: "WelcomePage",
  components: {
    QrcodeVue,
  },
  data() {
    return {
      user: {
        id: this.$route.query.id || "",
        name: this.$route.query.name || "",
        surname: this.$route.query.surname || "",
      },
      recievedStatus: null, // Initialize to null to indicate no status so far
      showStatus: false,
      errorMessage: "",
      loadingStatus: false,

      clock: '',
      intervalId: null,
    };
  },
  computed: {
    statusMessage() {
      if (this.recievedStatus === null) {
        return ""; // Or a default message if needed
      }
      switch (this.recievedStatus) {
        case "Red":
          return "Your payment and attendance requirements are unfulfilled";
        case "Orange b":
          return "You have month(s) unpaid.";
        case "Orange f":
          return "Your attendance is low.";
        case "Green":
          return "All good!";
        default:
          return "Status unavailable.";
      }
    },
    statusClass() {
      return this.recievedStatus ? `status-${this.recievedStatus.toLowerCase().replace(' ', '-')}` : '';
    },
  },

  mounted() {
    this.updateClock();
    this.intervalId = setInterval(this.updateClock, 1000);
  },

  beforeUnmount() {
    clearInterval(this.intervalId);
  },

  methods: {
    logout() {
      console.log('Logging out...');
      localStorage.removeItem('acc_token');
      this.$router.push('/'); // Redirect to the login page
    },
    toggleStatus() {
      this.showStatus = !this.showStatus;
      if (this.showStatus && !this.recievedStatus && !this.loadingStatus) {
        this.getValidityStatus();
      }
    },
    async getValidityStatus() {
      this.loadingStatus = true;
      this.recievedStatus = null;
      try {
        const userId = this.user.id;
        console.log(userId, localStorage.getItem("acc_token"));
        const data = await checkValidity(userId);
        this.recievedStatus = data.status;
      } catch (error) {
        this.errorMessage = error.message || "Error checking validity";
        console.error("Error checking validity:", error);
        this.recievedStatus = "unavailable"; // Set a status even on error
      } finally {
        this.loadingStatus = false; // Set loading to false after the API call completes (success or error)
      }
    },

    updateClock() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      this.clock = `${hours}:${minutes}:${seconds}`;
    },
  },
};
</script>

<style scoped>
/* Base styles for the admin panel layout (same as before) */
.admin-panel {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f6f8; /* Light background */
  color: #333;
}

/* Header styling (same as before) */
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

/* Logout button styling (same as before) */
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

/* Main content area (same as before, with added class for welcome page content) */
.admin-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #fff; /* White content background */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  margin: 20px;
  border-radius: 8px;
  display: flex; /* To center the welcome page content */
  justify-content: center;
  align-items: center;
}

.welcome-page-content {
  width: 100%; /* Ensure welcome page content takes full width within admin-content */
}

/* Footer styling (same as before) */
.admin-footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 10px;
  font-size: 14px;
}

/* Icon styling (requires Font Awesome or similar) (same as before) */
.fas {
  margin-right: 5px;
}

/* Responsive adjustments (same as before, adjusted for header) */
@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: center;
  }

  .logout-button {
    margin-top: 10px;
  }

  .admin-content {
    margin: 10px;
    padding: 15px;
  }
}

/* Specific styles for the welcome page content */
.welcome-page.container {
  text-align: center;
  max-width: 800px;
  width: 100%; /* Make it responsive within its container */
  background-color: #f5f5f5; /* Light background for contrast */
  padding: 30px; /* Increased padding */
  border-radius: 12px; /* More rounded corners */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15); /* Stronger shadow */
  transition: background-color 0.3s; /* Smooth transition */
}

.welcome-page.container .header h2 {
  font-size: 36px; /* Larger font size */
  color: #26a69a;
  margin-bottom: 20px; /* More spacing */
  font-weight: 600; /* Slightly bolder */
}

.welcome-page.container .qr-code-container {
  margin-top: 40px;
  margin-bottom: 30px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 12px;
  background-color: white; /* Contrasting background for QR code area */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.welcome-page.container .qr-code-container h3 {
  font-size: 20px;
  color: #555;
  margin-bottom: 15px;
}

/* Status Button */
.status-button {
  background-color: #007bff; /* Blue color */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px; /* Space from QR code */
}

.status-button:hover {
  background-color: #0056b3;
}

/* Status Container */
.status-container {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
}

.status-red {
  background-color: #ffebee;
  color: #d32f2f;
  border: 1px solid #d32f2f;
}

.status-orange-b {
  background-color: #fff3e0;
  color: #ff9800;
  border: 1px solid #ff9800;
}

.status-orange-f {
  background-color: #fff3e0;
  color: #ff9800;
  border: 1px solid #ff9800;
}

.status-green {
  background-color: #e8f5e9;
  color: #4caf50;
  border: 1px solid #4caf50;
}

.status-unavailable {
  background-color: #f5f5f5;
  color: #757575;
  border: 1px solid #757575;
}

/* Loading Indicator */
.loading-indicator {
  color: #777; /* Grey color for loading text */
  font-style: italic;
}
</style>