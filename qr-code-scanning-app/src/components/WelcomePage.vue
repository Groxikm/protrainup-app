<template>
  <div class="card">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="username" placeholder="Login" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit" class="special-button">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch(
          `https://example.com/api/login?username=${this.username}&password=${this.password}`
        );

        const data = await response.json();

        if (data.initials) {
          this.$router.push({ name: 'welcome', query: { initials: data.initials } });
        } else {
          alert('Login failed');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    },
  },
};
</script>

<style scoped>
/* (CSS styling will be defined separately in styles.css) */
</style>