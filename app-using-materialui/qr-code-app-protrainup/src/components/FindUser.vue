<template>
  <div class="container">
    <div v-if="user" :class="['user-card', { 'invalid-user': !validity, 'valid-user': validity }]">
      <div class="user-details">
        <h3>{{ user.name }} {{ user.surname }}</h3>
        <p><strong>Login:</strong> {{ user.login }}</p>
        <p><strong>Field:</strong> {{ user.password }}</p>
        <p><strong>Test avatar_link:</strong> {{ user.avatar_link }}</p>
        <p><strong>Valid Until:</strong> {{ user.valid_due }}</p>
      </div>
      <div class="avatar-container">
        <img :src="user.avatar_link" alt="User Avatar" class="avatar" />
      </div>

      <button class="delete-button" @click="deleteUser">Delete</button>
      <button class="edit-button" @click="toggleEdit">Edit</button>

      <div v-if="editing" class="edit-form">
        <input v-model="editData.name" placeholder="New Name" />
        <input v-model="editData.surname" placeholder="New Surname" />
        <input type="date" v-model="editData.valid_due" placeholder="New Valid Until" />
        <button @click="updateUser">Save</button>
      </div>
    </div>

    <div class="search-panel">
      <h2>Enter User</h2>
      <form @submit.prevent="getUserByNameSurname">
        <input v-model="query.name" placeholder="Name" />
        <input v-model="query.surname" placeholder="Surname" />
        <button type="submit">Find User</button>
      </form>
    </div>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { findUserByNameSurname, findUserById, checkValidity } from "../api/adminGETService.js";
import { changeUserNameSurname, changeUserValidDue, deleteUser } from "../api/adminPUTService.js";
import dayjs from "dayjs";

export default {
  data() {
    return {
      query: {

        name: "",
        surname: ""
      },
      userId: "",
      validity: true,
      user: null,
      errorMessage: "",
      editing: false,
      editData: {
        name: "",
        surname: "",
        valid_due: dayjs(new Date()).format('YYYY-MM-DD'),
      }
    };
  },
  mounted() {
    this.userId = localStorage.getItem("last_scanned_id");
    if (this.userId !== null) {
      this.getUserById(this.userId);
      this.getValidityStatus(this.userId);
    } else this.errorMessage = "No user ID found.";
  },
  methods: {
    // Search and load functionality
    async getUserById() {
      try {
        this.user = await findUserById(this.userId);
      } catch (error) {
        this.user = null;
        this.errorMessage = error.message || "Error finding user";
      }
    },

    async getValidityStatus(userId) {
      try {
        const data = await checkValidity(userId);
        this.validity = data.status;
      } catch (error) {
        this.validity = false;
        this.errorMessage = error.message || "Error checking validity";
      }
    },

    async loadUserCardById() {
      if (this.userId !== null) {
        await this.getUserById(this.userId);
        await this.getValidityStatus(this.userId);
      }
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

    // Editing functionality
    toggleEdit() {
      this.editing = !this.editing;
      if (this.user) {
        this.editData = { ...this.user };
      }
    },

    // This method handles three input field name, surname, valid_due to run changes in a single click
    async updateUser() {
      // Checks the validity of name surname just in case they get left empty
      if (this.editData.name !== null || this.editData.surname !== null) {
        try {
          const userDataJSON = {
              "id": this.userId,
              "name": this.editData.name,
              "surname": this.editData.surname
          }
          await changeUserNameSurname(userDataJSON);
          this.editing = false;
        } catch (error) {
          this.errorMessage = error.message || "Error updating name surname";
        }
      }
      // date change is checked. If it's not empty -- requests changes
      if (this.editData.valid_due !== null) {
        try {
          const formatedDate = dayjs(this.editData.valid_due).format('YY/MM/DD 12:00:00');;
          const userDataJSON = {
            "id": this.userId,
            "valid_due": formatedDate,
          }
          await changeUserValidDue(userDataJSON);
          this.editing = false;
        } catch (error) {
          this.errorMessage = error.message || "Error updating name surname";
        }
      }
      // Update and check the user card
      if (this.userId !== null) {
        await this.getUserById(this.userId);
        await this.getValidityStatus(this.userId);
      }

    },

    async deleteUser() {
      try {
        await deleteUser(this.user.id);
        this.user = null;
      } catch (error) {
        this.errorMessage = error.message || "Error deleting user";
      }
    }
  }
};
</script>

<style scoped>

/* General styles for the container */
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

/* Change border color and add an outline on focus */
input:focus {
  border-color: #26a69a; /* Change border color on focus */
  outline: none; /* Remove the default outline */
  box-shadow: 0 0 5px rgba(38, 166, 154, 0.5); /* Add a subtle shadow */
}

/* User card styles */
.user-card {
  position: relative;
  padding: 20px;
  border-radius: 8px;
  background: white; /* Changed to white for improved visibility */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
}

/* Valid and invalid user styles */
.valid-user {
  background: linear-gradient(to bottom, rgba(0, 255, 0, 0.25), transparent 30%); /* Lighter gradient */
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
}

.invalid-user {
  background: linear-gradient(to bottom, rgba(255, 0, 0, 0.3), transparent 30%); /* Lighter gradient */
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.2);
}

/* Button styles */
button {
  padding: 10px 20px; /* Increased padding for better touch and readability */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px; /* Larger font size for better readability */
  transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth transition effects */
}

/* Edit button styles */
.edit-button {
  background-color: #2196f3;
  color: white;
  position: relative;
}

/* Hover effect on edit button */
.edit-button:hover {
  background-color: #1976d2;
  transform: translateY(-2px); /* Raise button effect */
}

/* Delete button styles */
.delete-button {
  background-color: #d32f2f;
  color: white;
  position: absolute;
  right: 10px;
}

/* Hover effect on delete button */
.delete-button:hover {
  background-color: #b71c1c;
  transform: translateY(-2px); /* Raise button effect */
}

/* Avatar container styles */
.avatar-container {
  position: absolute;
  top: 20px;
  right: 20px;
}

/* Avatar image styles */
.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
}

</style>
