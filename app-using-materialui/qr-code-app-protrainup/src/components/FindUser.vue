<template>
  <div class="container">

    <div v-if="user" :class="['user-card', { 'invalid-user': !validity }]">
      <div class="avatar-container">
        <img :src="user.avatar_link" alt="User Avatar" class="avatar" />
      </div>
      <div class="user-details">
        <h3>{{ user.name }} {{ user.surname }}</h3>
        <p><strong>Login:</strong> {{ user.login }}</p>
        <p><strong>Field:</strong> {{ user.password }}</p>
        <p><strong>Test avatar_link:</strong> {{ user.avatar_link }}</p>
        <p><strong>Valid Until:</strong> {{ user.valid_due }}</p>
      </div>
    </div>
    <div class="search-panel">
      <h2>Enter User</h2>
      <form @submit.prevent="getUserByNameSurname">
        <input v-model="query.name" placeholder="Name" />
        <input v-model="query.surname" placeholder="Surname" />
        <button type="submit">Find User</button>
      </form>
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { findUserByNameSurname, findUserById, checkValidity } from "../services/adminService.js";

export default {
  data() {
    return {
      query: {
        id: "",
        name: "",
        surname: ""
      },
      validity: true,
      user: null,
      errorMessage: ""
    };
  },
  mounted() {
    const userId = localStorage.getItem("last_scanned_id");
    if (userId !== null) {
      this.getUserById(userId);
      this.getValidityStatus(userId);
    }
  },
  methods: {
    async getUserByNameSurname() {
      try {
        this.user = await findUserByNameSurname(this.query.name, this.query.surname);
        if (this.user) {
          this.getValidityStatus(this.user.id);
        }
      } catch (error) {
        this.user = null;
        this.errorMessage = error.message || "Error finding user";
      }
    },

    async getUserById(userId) {
      try {
        this.user = await findUserById(userId);
      } catch (error) {
        this.user = null;
        this.errorMessage = error.message || "Error finding user";
      }
    },

    async getValidityStatus(userId) {
      try {
        const data = await checkValidity(userId);
        this.validity = data.status;
      } catch (error) {
        this.validity = false;
        this.errorMessage = error.message || "Error checking validity";
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-panel {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

input {
  margin: 3px 3px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.2s ease;
  width: 100%;
}

input:focus {
  border-color: #26a69a;
  outline: none;
}

button {
  margin: 3px 3px;
  padding: 0.5rem 1.5rem;
  background-color: #26a69a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

button:hover {
  background-color: #1d9a87;
}

.user-card {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.invalid-user {
  background: linear-gradient(to bottom, rgba(255, 0, 0, 0.5), transparent 30%);
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.4);
}

.avatar-container {
  position: absolute;
  top: 20px;
  right: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  padding-right: 100px;
}

.error-message {
  color: red;
  font-weight: bold;
}
</style>