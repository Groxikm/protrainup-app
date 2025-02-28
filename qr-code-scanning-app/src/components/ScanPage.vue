<template>
  <div class="card">
    <h2>Welcome, {{ user.name }} {{ user.surname }}!</h2>
    <p>Your ID: {{ user.id }}</p>

    <!-- QR Code Display -->
    <div v-if="user.id" class="qr-code-container">
      <qrcode-vue :value="user.id" :size="200" level="H" />
      <p>Scan this QR code to get your ID.</p>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';

export default {
  components: {
    QrcodeVue,
  },
  data() {
    return {
      user: {
        id: '123456', // Replace with actual user ID
        name: 'John',
        surname: 'Doe',
      },
    };
  },
};
</script>

<style scoped>
.card {
  text-align: center;
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.qr-code-container {
  margin-top: 20px;
}
</style>
