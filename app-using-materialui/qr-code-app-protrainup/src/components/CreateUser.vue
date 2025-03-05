<template>
  <div>
    <h2>Create User</h2>
    <form @submit.prevent="createUser">
      <input v-model="query.name" placeholder="Name" required />
      <input v-model="query.surname" placeholder="Surname" required />
      <input v-model="query.login" placeholder="Login" required />
      <input type="password" v-model="query.password" placeholder="Password" required />
      <input v-model="query.avatar_link" placeholder="Avatar Link" required />
      <input type="date" v-model="query.valid_due" placeholder="Valid Due" required />
      <button type="submit">Submit</button>
    </form>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import {addUser} from "../api/adminPOSTService.js";
import dayjs from 'dayjs'

export default {
  data() {
    return {
      query: {
        name: '',
        surname: '',
        login: '',
        password: '',
        avatar_link: '',
        valid_due: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    async createUser() {
      try {
        this.query.valid_due =  dayjs(this.query.valid_due).format('MM/DD/YY 12:00:00');
        const jsonQuery = JSON.stringify(this.query);

        await addUser(jsonQuery);
      } catch (error) {
        this.errorMessage = error.message || "Error finding user";
      }
    },
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  width: 300px;
}

input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  padding: 0.5rem;
  font-size: 1rem;
}

.error-message {
  color: red;
  font-weight: bold;
}
</style>