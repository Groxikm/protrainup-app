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
import {API_URL} from "../settings.js";

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
      const userData = { ...this.query }; // collects data in a json
      console.log('Sending JSON:', JSON.stringify(userData));
      try {
        const response = await fetch(`${API_URL}/api/find-user-by-name-surname?name=${encodeURIComponent(this.query.name)}&surname=${encodeURIComponent(this.query.surname)}`,
            {
              method: 'POST',
              headers: {
                'accessToken': localStorage.getItem('acc_token'),
              },
              body: userData
            });
        if (!response.ok) {
          throw new Error('User not found');
        }
        this.errorMessage = '';

      } catch (error) {
        this.user = null;
        this.errorMessage = error.message || 'Error creating user';
      }


    }
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