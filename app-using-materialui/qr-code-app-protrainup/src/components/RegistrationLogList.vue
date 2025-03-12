<template>
  <div>
    <table>
      <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Surname</th>
        <th>Login</th>
        <th>Valid Due</th>
        <th>Avatar</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(user, index) in users" :key="user.id">
        <td>{{ index + 1 }}</td>
        <td>{{ user.name }}</td>
        <td>{{ user.surname }}</td>
        <td>{{ user.club }}</td>
        <td>{{ user.visit_frequency }}</td>
        <td>{{ user.backlog }}</td>
        <td>
          <img :src="formatAvatar(user.avatar_link)" alt="Avatar" width="32" height="32">
          <img :src="formatAvatar(user.club_link)" alt="Club" width="32" height="32">
        </td>
      </tr>
      </tbody>
    </table>
    <button @click="loadMoreUsers">Load More</button>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import {findAllRegAttempts} from "../api/adminGETService.js";

const user_arr =[];
export default {

  data() {
    return {
      query: {
        id: "",
        name: "",
        surname: ""
      },
      users: [],
      lastUserId: null,
      limit: 10,
      errorMessage: "",
    };
  },
  async mounted() {
    console.log(this.users, "THIS USERS");
    await this.loadMoreUsers();
  },
  methods: {
    async loadMoreUsers() {
      try {
        const data = await findUsers();

        this.lastUserId = data.lastUserId;
        this.users.push(...data.users);
        user_arr.push(...data.users);
        console.log(data, this.users, "user arr", user_arr);
      } catch (error) {
        console.error('Error fetching users:', error);
        this.errorMessage = error.message || "Error finding user";
      }
    },
    formatAvatar(avatarLink) {
      return avatarLink && typeof avatarLink === 'string' ? avatarLink : 'https://via.placeholder.com/32';
    },
    async getUserByNameSurname() {
      try {
        this.user = await findUserByNameSurname(this.query.name, this.query.surname);
        if (this.user) {
          await this.getValidityStatus(this.user.id);
        }
      } catch (error) {
        this.user = null;
        this.errorMessage = error.message || "Error finding user";
      }
    },
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

button {
  margin-top: 10px;
  padding: 8px 12px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

/* Styles for input and search panel */
.search-panel {
  flex: 1;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Adds space between inputs */
}

input {
  padding: 10px; /* Increased padding for a better touch target */
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease, box-shadow 0.2s ease; /* Smoother transition for focus */
  font-size: 16px; /* Larger font size for better readability */
}

</style>
