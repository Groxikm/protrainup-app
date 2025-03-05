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
  </div>
</template>

<script>
import {addUser, findUserByNameSurname} from "../services/adminService.js";

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
      user: null,
      errorMessage: ''
    };
  },
  methods: {
    async createUser() {
      console.log("this.query is");
      console.log(this.query);
      try {
        this.user = await addUser(this.query);
        if (this.user) {
          this.getValidityStatus(this.user.id);
        }
      } catch (error) {
        this.user = null;
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
</style>