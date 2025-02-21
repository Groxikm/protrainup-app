<template>
  <div>
    <header>
      <h1>Welcome, {{ admin.name }} {{ admin.surname }} from {{ admin.city }}</h1>
    </header>
    <nav>
      <button @click="currentComponent = 'CreateUser'">Create User</button>
      <button @click="currentComponent = 'FindUser'">Find User</button>
    </nav>
    <component :is="currentComponent" />
  </div>
</template>

<script>
import CreateUser from './CreateUser.vue';
import FindUser from './FindUser.vue';

export default {
  components: {
    CreateUser,
    FindUser,
  },
  data() {
    return {
      currentComponent: 'CreateUser', // Default component
      admin: {
        name: 'AdminName',
        surname: 'AdminSurname',
        city: 'AdminCity'
      }
    };
  }
}
</script>

<style scoped>
h1 {
  margin-bottom: 2rem;
}

nav {
  margin-bottom: 2rem;
}

button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>