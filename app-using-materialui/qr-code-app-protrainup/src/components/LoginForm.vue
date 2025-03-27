<template>
  <div class="admin-panel login-panel">
    <header class="admin-header">
      <h1>Login</h1>
      <div class="clock">{{ clock }}</div> </header>

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
      id: '',
      username: '',
      password: '',
      errorMessage: '',
      clock: '', // Data property for the clock
      intervalId: null, // To store the interval ID for cleanup
    };
  },

  mounted() {
    const token = localStorage.getItem('acc_token');
    if (token || token !== null) {
      this.handleLogin(token);
    }
    this.updateClock(); // Initialize the clock
    this.intervalId = setInterval(this.updateClock, 1000); // Update every second
  },

  beforeUnmount() {
    clearInterval(this.intervalId); // Clear the interval when the component unmounts
  },

  methods: {
    updateClock() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      this.clock = `${hours}:${minutes}:${seconds}`;
    },
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
          this.errorMessage = data.message;
          if ((token || token !== null) && this.password !== undefined && this.login !== undefined) {
            this.errorMessage = "Login Failed";
            localStorage.setItem("acc_token", null);
          }
          //alert(data.message || 'Login failed');
        }
      } catch (error) {
        this.errorMessage = error;
      }
    },
  },
};
</script>

<style scoped>

.admin-panel {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f6f8;
  color: #333;
}


.admin-header {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.admin-header .clock {
  font-size: 1.2em;
  font-weight: bold;
  margin-right: 10px;
}


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
  width: 100%;
}


.admin-footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 10px;
  font-size: 14px;
}


.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 450px;
  width: 100%;
  text-align: center;
}

.card h2 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 25px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

input[type="text"],
input[type="password"] {
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3); /* Subtle focus shadow */
}

input[type="text"]::placeholder,
input[type="password"]::placeholder {
  color: #999;
}

button.special-button {
  background-color: #3498db;
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
  background-color: #2980b9;
}

.error-message {
  color: #c0392b;
  margin-top: 15px;
  padding: 12px;
  background-color: #fdecea;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #e74c3c;
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

  .admin-header {
    flex-direction: column;
    align-items: center;
  }

  .admin-header h1 {
    margin-bottom: 10px;
  }

  .admin-header .clock {
    margin-right: 0;
  }
}
</style>