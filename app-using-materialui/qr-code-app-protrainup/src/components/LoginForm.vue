<template>
  <div class="admin-panel login-panel">
    <header class="admin-header">
      <h1>Login</h1>
    </header>

    <main class="admin-content login-content">
      <div class="card">
        <form @submit.prevent="handleLogin">
          <input type="text" v-model="username" placeholder="Login" required />
          <input type="password" v-model="password" placeholder="Password" required />
          <button type="submit" class="special-button">Login</button>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </form>
      </div>
    </main>

    <footer class="admin-footer">
      <p>&copy; 2025 User Management System</p>
    </footer>
  </div>
</template>

<script>
import { API_URL } from '../settings';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    };
  },

  mounted() {
    const token = localStorage.getItem('acc_token');
    if (token || token !== null) {
      this.handleLogin(token);
    }
    this.errorMessage = '';
  },

  methods: {
    async handleLogin(token = "") {
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accessToken': token
          },
          body: JSON.stringify({
            login: this.username,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("acc_token", data.accessToken);

          if (data.role === "ADMIN") {
            this.$router.push({ name: 'admin' });
          } else {
            this.$router.push({
              name: 'welcome',
              query: {
                id: data.id,
                name: data.name,
                surname: data.surname,
              },
            });
          }
        } else {
          if ((token || token !== null) && this.password !== undefined && this.login !== undefined) {
            this.errorMessage = "Login Failed";
            localStorage.setItem("acc_token", null);
          }
          //alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
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
}

.admin-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

/* Main content area (same as before, with added class for login content) */
.admin-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #fff; /* White content background */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  margin: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-content {
  width: 100%; /* Ensure login content takes full width within admin-content */
}

/* Footer styling (same as before) */
.admin-footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 10px;
  font-size: 14px;
}

/* Specific styles for the login card */
.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px; /* Increased padding for better spacing */
  max-width: 450px; /* Slightly wider */
  width: 100%; /* Make it responsive within its container */
  text-align: center; /* Center the form elements */
}

.card h2 {
  font-size: 28px; /* Larger heading */
  color: #2c3e50; /* Darker heading color */
  margin-bottom: 25px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Make form elements take full width */
}

input[type="text"],
input[type="password"] {
  padding: 12px; /* Increased padding */
  margin-bottom: 20px;
  border: 1px solid #ddd; /* Light gray border */
  border-radius: 6px; /* More rounded corners */
  font-size: 16px;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #3498db; /* Blue focus color */
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3); /* Subtle focus shadow */
}

input[type="text"]::placeholder,
input[type="password"]::placeholder {
  color: #999;
}

button.special-button {
  background-color: #3498db; /* Blue button color */
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
}

button.special-button:hover {
  background-color: #2980b9; /* Darker blue on hover */
}

.error-message {
  color: #c0392b; /* Red error color */
  margin-top: 15px;
  padding: 12px;
  background-color: #fdecea;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #e74c3c; /* Subtle red border */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .login-content {
    margin: 10px;
    padding: 15px;
  }

  .card {
    margin: 20px;
    padding: 20px;
  }

  .card h2 {
    font-size: 24px;
  }

  input[type="text"],
  input[type="password"] {
    font-size: 14px;
    padding: 10px;
  }

  button.special-button {
    font-size: 16px;
    padding: 10px 20px;
  }
}
</style>