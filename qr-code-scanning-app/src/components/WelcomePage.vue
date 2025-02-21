<template>
  <div class="card">
    <h2>Welcome!</h2>
    <p>Welcome, {{ userInitials }}!</p>

    <!-- QR Code Generator Section -->
    <div v-if="qrData">
      <h3>Your QR Code:</h3>
      <qrcode-vue :value="qrData" :size="200" level="M" />
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
      qrData: '', // Stores JSON data to be converted into QR
    };
  },
  computed: {
    userInitials() {
      return this.$route.query.initials || 'Guest';
    },
  },
  methods: {
    generateQRCode() {
      // Example JSON data to encode into the QR code
      const jsonData = {
        name: this.userInitials,
        timestamp: new Date().toISOString(),
        message: "Hello from QR Code!",
      };

      // Convert JSON to string and store it in qrData
      this.qrData = JSON.stringify(jsonData);
    },
  },
  created() {
    this.generateQRCode(); // Generate the QR code when the component is created
  },
};
</script>

<style scoped>
.card {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

h2, h3 {
  margin-bottom: 10px;
}

p {
  margin-top: 0;
  margin-bottom: 20px;
}
</style>