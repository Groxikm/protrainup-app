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
        valid_due: dayjs(new Date()).format('YYYY-MM-DD'),
      },
      errorMessage: ''
    };
  },
  methods: {
    async createUser() {
      try {
        const formatedDate =  dayjs(this.query.valid_due).format('YY/MM/DD 12:00:00');
        const jsonData = {
          "name": this.query.name,
          "surname": this.query.surname,
          "login": this.query.login,
          "password": this.query.password,
          "avatar_link": this.query.avatar_link,
          "valid_due": formatedDate
        }
        for (const key in jsonData) {
          if (!jsonData[key]) {
            throw new Error(`Missing value for ${key}`);
          }
        }
        await addUser(jsonData);
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