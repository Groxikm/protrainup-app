<template>
  <div class="welcome-page container">
    <div class="header">
      <h2>Welcome, {{ user.name }} {{ user.surname }}!</h2>
    </div>

    <div class="qr-code-container">
      <h3>Your ID as QR Code:</h3>
      <qrcode-vue :value="user.id" :size="250" level="M" />
    </div>

  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";

export default {
  name: "WelcomePage",
  components: {
    QrcodeVue,
  },
  data() {
    return {
      user: {
        id: this.$route.query.id || "",
        name: this.$route.query.name || "",
        surname: this.$route.query.surname || "",
      },
    };
  },

};
</script>

<style scoped>
.welcome-page {
  text-align: center;
  max-width: 800px;
  margin: 40px auto;
  background-color: #f5f5f5; /* Light background for contrast */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow */
  transition: background-color 0.3s; /* Smooth transition */
}

.header h2 {
  font-size: 32px;
  color: #26a69a;
  margin-bottom: 15px; /* Spacing for better separation */
}

.qr-code-container {
  margin-top: 30px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background-color: white; /* Contrasting background for QR code area */
}
</style>