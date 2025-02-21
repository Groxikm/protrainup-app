<template>
  <div>
    <h2>Create User</h2>
    <form @submit.prevent="createUser">
      <input v-model="user.name" placeholder="Name" required />
      <input v-model="user.surname" placeholder="Surname" required />
      <input v-model="user.login" placeholder="Login" required />
      <input type="password" v-model="user.password" placeholder="Password" required />
      <input type="number" v-model.number="user.visitFrequency" placeholder="Visit Frequency" required />
      <input type="date" v-model="user.validDue" placeholder="Valid Due" required />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: '',
        surname: '',
        login: '',
        password: '',
        visitFrequency: null,
        validDue: ''
      }
    };
  },
  methods: {
    createUser() {
      // Collect data into JSON
      const userData = { ...this.user };

      // POST request simulation
      console.log('Sending JSON:', JSON.stringify(userData));

      // In a real application, use `fetch` or `axios` to send the userData to the server
      // fetch('your-api-endpoint', { method: 'POST', body: JSON.stringify(userData), headers: { 'Content-Type': 'application/json' }});
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