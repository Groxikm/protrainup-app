<template>
  <div class="ScanQRPage">
    <!-- Camera box with border, automatically active on component creation -->
    <div v-if="scannerActive" class="camera-box">
      <QRCodeScanner @json-extracted="handleJsonExtracted" />
    </div>


    <div v-if="user" class="json-display">
      <h3>User Details:</h3>
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Surname:</strong> {{ user.surname }}</p>
      <p><strong>Login:</strong> {{ user.login }}</p>
      <p><strong>Password:</strong> {{ user.password }}</p>
      <p><strong>Visit Frequency:</strong> {{ user.visit_frequency }}</p>
      <p><strong>Valid Until:</strong> {{ user.valid_due }}</p>
    </div>


    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import QRCodeScanner from './QRCodeScanner.vue';

export default {
  name: 'ScanPage',
  components: {
    QRCodeScanner
  },
  data() {
    return {
      scannerActive: true, // Initialize scanner immediately
      user: null, // Will hold the parsed user data
      errorMessage: ''
    };
  },
  methods: {
    handleJsonExtracted(data) {
      console.log('Extracted QR code data:', data);
      try {

        const parsedData = JSON.parse(data);


        if (this.isValidUser(parsedData)) {
          this.user = parsedData;
          this.errorMessage = '';
        } else {
          throw new Error('Invalid user data structure');
        }
      } catch (error) {
        this.errorMessage = error.message || 'Failed to parse JSON';
        this.user = null;
      }
      this.scannerActive = false; // Close scanner after processing
    },
    isValidUser(data) {
      // Check if the data matches expected structure
      return data.name && data.surname && data.login &&
             typeof data.password === 'string' &&
             typeof data.visit_frequency === 'number' &&
             data.valid_due;
    }
  }
};
</script>

<style scoped>
.ScanQRPage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

/* Camera box styling */
.camera-box {
  width: 100%;
  max-width: 400px;
  border: 2px solid #26a69a;
  border-radius: 8px;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* User details display styling */
.json-display {
  margin-top: 20px;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.error-message {
  color: red;
  font-weight: bold;
}

/* Responsive styles */
@media (max-width: 768px) {
  .camera-box {
    max-width: 100%;
  }
}
</style>