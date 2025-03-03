<template>
  <div class="delete-user">
    <h2>Delete User</h2>
    <form @submit.prevent="deleteUser">
      <label for="userId">User ID:</label>
      <input type="text" v-model="userId" required />
      <button type="submit">Delete User</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: ''
    };
  },
  methods: {
    deleteUser() {
      // API call to delete user
      console.log("Deleting user with ID:", this.userId);
    }
  }
};
</script>

<style scoped>
.delete-user {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
form {
  display: flex;
  flex-direction: column;
}
label {
  margin-top: 10px;
}
input {
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  margin-top: 15px;
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
}
button:hover {
  background-color: #c9302c;
}
</style>