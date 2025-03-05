<template>
  <div class="container">
    <div class="search-panel">
      <h2>Find User</h2>
      <form @submit.prevent="getUserByNameSurname">
        <input v-model="query.name" placeholder="Name" />
        <input v-model="query.surname" placeholder="Surname" />
        <button type="submit">Find User</button>
      </form>
    </div>

    <div v-if="user" class="user-card">
      <div class="avatar-container">
        <img :src="user.avatar_link" alt="User Avatar" class="avatar" />
      </div>
      <div class="user-details">
        <h3>{{ user.name }} {{ user.surname }}</h3>
        <p><strong>Login:</strong> {{ user.login }}</p>
        <p><strong>field:</strong> {{ user.password }}</p>
        <p><strong>Test avatar_link:</strong> {{ user.avatar_link }}</p>
        <p><strong>Valid Until:</strong> {{ user.valid_due }}</p>
      </div>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { findUserByNameSurname, findUserById } from "../services/adminService.js";
import {API_URL} from "../settings.js";

export default {
  data() {
    return {
      query: {
        id: '',
        name: '',
        surname: ''
      },
      user: null,
      errorMessage: ''
    };
  },
  mounted() {
    API_URL
    // Fetch user details based on userId when the component is mounted
    const userId = localStorage.getItem('last_scanned_id');
    if (userId !== null) {
      this.getUserById(userId);
    }
  },
  methods: {
     async getUserByNameSurname(userName, userSurname) {
      try {
        this.user = await findUserByNameSurname(userName, userSurname);
      }
      catch (error) {
        this.user = null;
        this.errorMessage = error.message || 'Error finding user';
      }
    },

     async getUserById(userId) {
      try {
        try {
          this.user = await findUserById(userId);
        }
        catch (error) {
          this.user = null;
          this.errorMessage = error.message || 'Error finding user';
        }
      } catch (error) {
        this.user = null;
        this.errorMessage = error.message || 'Error finding user';
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  max-width: 800px;
  margin: auto;
}

.search-panel {
  flex: 1;
}

.user-card {
  flex: 2;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.avatar-container {
  position: absolute;
  top: 10px;
  right: 10px;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px solid #ddd;
}

input {
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  width: 100%;
  max-width: 300px;
}

button {
  padding: 0.5rem 1.5rem;
  background-color: #26a69a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #1d9a87;
}

.error-message {
  color: red;
  font-weight: bold;
}
</style>
