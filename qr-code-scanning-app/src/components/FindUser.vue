<template>
  <div>
    <h2>Find User</h2>
    <form @submit.prevent="findUser">
      <input v-model="query.id" placeholder="ID" />
      <input v-model="query.name" placeholder="Name" />
      <input v-model="query.surname" placeholder="Surname" />
      <button type="submit">Find User</button>
    </form>

    <div v-if="user">
      <h3>User Details</h3>
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Surname:</strong> {{ user.surname }}</p>
      <p><strong>Login:</strong> {{ user.login }}</p>
      <p><strong>Password (hashed):</strong> {{ user.password }}</p>
      <p><strong>Visit Frequency:</strong> {{ user.visit_frequency }}</p>
      <p><strong>Valid Until:</strong> {{ user.valid_due }}</p>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { API_URL } from '../settings';
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
  methods: {
    async findUser() {
      try {
        const response = await fetch(`${API_URL}/api/find-user-by-name-surname?&name=${encodeURIComponent(this.query.name)}&surname=${encodeURIComponent(this.query.surname)}`,
        {
                method: 'GET',
                headers: {
                    'accessToken': localStorage.getItem('acc_token'),
                }
            });

        if (!response.ok) {
          throw new Error('User not found');
        }

        this.user = await response.json();
        this.errorMessage = '';
      } catch (error) {
        this.user = null;
        this.errorMessage = error.message || 'Error finding user';
      }
    }
  }
}
</script>

<style scoped>
h2 {
  font-size: 24px;
  margin-bottom: 1rem;
}

form {
  margin-bottom: 2rem;
}

input {
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  width: 100%;
  max-width: 400px;
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