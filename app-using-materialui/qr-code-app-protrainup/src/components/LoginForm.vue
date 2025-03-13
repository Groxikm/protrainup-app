<template>
  <div class="card">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="username" placeholder="Login" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit" class="special-button">Login</button>
    </form>
  </div>
</template>

<script>
import { API_URL } from '../settings';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            login: this.username,
            password: this.password,
          }),
        });

        const data = await response.json();
        //console.log(data);
        localStorage.setItem("acc_token", data.accessToken);
        if (response.ok) {

          // Pass all necessary data to the WelcomePage
          this.$router.push({
            name: 'welcome',
            query: {
              id: data.id,
              name: data.name,
              surname: data.surname,
            }
          });
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Base styles */
body {
  font-family: 'Roboto', arial, sans-serif;
  color: #444;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h2 {
  font-size: 24px;
  color: #26a69a;
  margin-bottom: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 400px;
  margin: 50px auto;
}

form {
  display: flex;
  flex-direction: column;
}

input[type="text"],
input[type="password"] {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 14px;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #26a69a;
  outline: none;
}

input[type="text"]::placeholder,
input[type="password"]::placeholder {
  color: #a6a6a6;
}

button.special-button {
  background-color: #26a69a;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.special-button:hover {
  background-color: #e9553b;
}

a {
  color: #26a69a;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #e74124;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .card {
    margin: 20px;
    padding: 15px;
  }

  h2 {
    font-size: 20px;
  }

  input[type="text"],
  input[type="password"] {
    font-size: 12px;
  }

  button.special-button {
    font-size: 14px;
    padding: 8px 16px;
  }
}
</style>