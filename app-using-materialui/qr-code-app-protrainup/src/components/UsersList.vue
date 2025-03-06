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
        <td>{{ user.login }}</td>
        <td>{{ user.valid_due }}</td>
        <td>
          <img :src="formatAvatar(user.avatar_link)" alt="Avatar" width="32" height="32">
        </td>
      </tr>
      </tbody>
    </table>
    <button @click="loadMoreUsers">Load More</button>
  </div>
</template>

<script>
import { findUsers } from "../api/adminGETService.js";

export default {
  data() {
    return {
      users: [],
      lastUserId: null,
    };
  },
  async mounted() {
    await this.loadMoreUsers();
  },
  methods: {
    async loadMoreUsers() {
      try {

        const data = await findUsers(this.lastUserId);
        this.lastUserId = data.lastUserId;
        this.users.push(...data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    formatAvatar(avatarLink) {
      return avatarLink && typeof avatarLink === 'string' ? avatarLink : 'https://via.placeholder.com/32';
    }
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
</style>
