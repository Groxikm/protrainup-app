<template>
  <div class="card">
    <h2>QR Code Scanner</h2>
    <qrcode-stream @detect="onDetect" @error="onError"></qrcode-stream>
    <p v-if="scannedId">Scanned ID: {{ scannedId }}</p>
    <p v-if="serverResponse">{{ serverResponse }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader';
import { API_URL } from "../settings";

export default {
  name: 'ScanPageComponent',
  components: {
    QrcodeStream,
  },
  data() {
    return {
      scannedId: null,
      serverResponse: '',
      errorMessage: ''
    };
  },
  methods: {
    async onDetect(detectedCodes) {
      if (detectedCodes.length > 0) {
        const scannedData = detectedCodes[0].rawValue;
        // console.log('Detected QR Code:', scannedData); // debug on the side of the component
        if (scannedData) {
          this.scannedId = scannedData;
          this.$emit('id-scanned', this.scannedId); // key string which shares data with the AdminPage
          await this.checkValidity(this.scannedId);
        } else {
          alert('Invalid QR Code format!');
        }
      }
    },

    onError(error) {
      console.error('QR Scanner Error:', error);
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