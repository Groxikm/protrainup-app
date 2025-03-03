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
// import { API_URL } from "@/settings";

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
  methods: {
    async onDetect(detectedCodes) {
      if (detectedCodes.length > 0) {
        const scannedData = detectedCodes[0].rawValue;
        console.log('Detected QR Code:', scannedData);
        if (scannedData) {
          this.scannedId = scannedData; // Store the scanned ID
          this.$emit('id-scanned', this.scannedId); // Emit the scanned ID to the parent
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
      // Code to send the scanned ID to a server (omitted for brevity)
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
