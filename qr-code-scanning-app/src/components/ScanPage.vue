<template>
  <div class="card">
    <h2>QR Code Scanner</h2>

    <qrcode-stream @detect="onDetect" @error="onError"></qrcode-stream>

    <p v-if="scannedId">Scanned ID: {{ scannedId }}</p>

    <button v-if="scannedId" @click="sendScannedId">Send to Server</button>

    <p v-if="serverResponse">{{ serverResponse }}</p>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader';
import { API_URL } from "@/settings";

export default {
  name: 'ScanPageComponent',
  components: {
    QrcodeStream,
  },
  data() {
    return {
      scannedId: null,
      serverResponse: '',
    };
  },
  provide() {
    return {
      scannedId: this.scannedId // Provide the scanned ID to descendant components
    };
  },
  methods: {
    async onDetect(detectedCodes) {
      if (detectedCodes.length > 0) {
        const scannedData = detectedCodes[0].rawValue;
        console.log('Detected QR Code:', scannedData);

        if (scannedData) {
          this.scannedId = scannedData; // Store the scanned ID
        } else {
          alert('Invalid QR Code format!');
        }
      }
    },
    async sendScannedId() {
      if (!this.scannedId) {
        alert('No valid ID scanned!');
        return;
      }

      try {
        const token = localStorage.getItem('accessToken');
        const location = "default";
        console.log('Detected token:', token);

        const response = await fetch(`${API_URL}/api/user-reg-attempt?&id=${encodeURIComponent(this.query.id)}&location=${encodeURIComponent(this.query.surname)}`, {
          method: 'POST', // Changed to POST request
          headers: {
            'accessToken': localStorage.getItem('acc_token'),
          },
          body: JSON.stringify({
            id: this.scannedId,
            location: location
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'User not found');
        }

        this.serverResponse = result.message;
        alert(`Server Response: ${result.message}`);
      } catch (error) {
        this.serverResponse = 'Error sending data';
        alert('Failed to send data to the server.');
        console.error(error);
      }
    },
    onError(error) {
      console.error('QR Scanner Error:', error);
      alert('QR Scanner Error: ' + error.message);
    },
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

button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
