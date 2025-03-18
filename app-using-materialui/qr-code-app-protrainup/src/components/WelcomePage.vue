<template>
  <div class="admin-panel">
    <header class="admin-header">
      <h1>Welcome</h1>
      <button @click="logout" class="logout-button">
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
      </div>
    </main>

    <footer class="admin-footer">
      <p>&copy; 2025 User Management System</p>
    </footer>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";

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
    };
  },
  methods: {
    logout() {
      console.log('Logging out...');
      localStorage.removeItem('acc_token');
      this.$router.push('/'); // Redirect to the login page
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
</style>