<template>
  <div>
    <header>
      <h1>Welcome, {{ admin.name }} {{ admin.surname }} from {{ admin.city }}</h1>
    </header>
    <nav>
      <button @click="currentComponent = 'CreateUser'">Create User</button>
      <button @click="currentComponent = 'FindUser'">Find User</button>
      <button @click="currentComponent = 'ScanPage'">Scan User QR</button>
    </nav>
    <component :is="currentComponent" />
  </div>
</template>

<script>
import CreateUser from './CreateUser.vue';
import FindUser from './FindUser.vue';
import ScanPage from './ScanPage.vue';

export default {
  components: {
    CreateUser,
    FindUser,
    ScanPage
  },
  data() {
    return {
      currentComponent: 'CreateUser', // Default component
      admin: {
        name: 'AdminName',
        surname: 'AdminSurname',
        city: 'Wroclaw'
      }
    };
  }
}
</script>

<style scoped>
/*
 * Admin Page Styles
 * This CSS is dedicated to the Admin page component with styling inspired by the Velocity template.
 */

/* ======= Base Styles ======= */
body {
  font-family: 'Roboto', Arial, sans-serif; /* Matches the font from the template */
  color: #444; /* Darker color for text */
  font-size: 16px;
  background-color: #f5f5f5; /* Light background */
  margin: 0;
  padding: 20px; /* Global padding */
}

h1 {
  font-size: 36px; /* Larger header font for welcoming */
  color: #26a69a;  /* Color from the template color scheme */
  margin-bottom: 1rem;
}

nav {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: white; /* White background for nav */
  border-radius: 8px; /* Round edges */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Light shadow for depth */
}

button {
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease; /* Smooth transition */
  border: none; /* Remove default border */
  border-radius: 4px; /* Rounded corners */
  background-color: #26a69a; /* Admin theme color */
  color: white; /* Button text color */
}

button:hover {
  background-color: #1d9a87; /* Darken the button on hover */
}

button:focus {
  outline: none; /* Remove outline on focus */
}

/* ======= Responsive Styles ======= */
@media (max-width: 768px) {
  h1 {
    font-size: 28px; /* Smaller font size for mobile */
  }

  button {
    width: 100%; /* Full width buttons on small screens */
    margin-bottom: 1rem; /* Space between buttons */
  }
}

</style>