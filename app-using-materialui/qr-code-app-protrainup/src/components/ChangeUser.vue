<template>
  <div class="change-user">
    <h2>Update User Information</h2>
    <form @submit.prevent="updateUser">
      <label for="userId">User ID:</label>
      <input type="text" v-model="userId" required />

      <label for="newName">New Name:</label>
      <input type="text" v-model="newName" />

      <label for="newSurname">New Surname:</label>
      <input type="text" v-model="newSurname" />

      <label for="newValidDue">New Valid Until:</label>
      <input type="date" v-model="newValidDue" />

      <button type="submit">Update User</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: '',
      newName: '',
      newSurname: '',
      newValidDue: ''
    };
  },
  methods: {
    updateUser() {
      // API call to update user details
      console.log("Updating user:", this.userId, this.newName, this.newSurname, this.newValidDue);
    }
  }
};
</script>

<style scoped>
.change-user {
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
  background-color: #26a69a;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
}
button:hover {
  background-color: #1d9a87;
}
</style>