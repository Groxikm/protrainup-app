<template>
  <div class="hello">
    <ButtonComponent label="Scan QR Code" @activate-scanner="showScanner" />
    <QRCodeScanner v-if="scannerActive" @json-extracted="handleJsonExtracted" />
    <div v-if="jsonData" class="json-display">
      <h3>Scanned QR Code Data:</h3>
      <pre>{{ formattedJsonData }}</pre>
    </div>
  </div>
</template>

<script>
import ButtonComponent from './ButtonComponent.vue';
import QRCodeScanner from './QRCodeScanner.vue';

export default {
  name: 'HelloWorld',
  components: {
    ButtonComponent,
    QRCodeScanner
  },
  data() {
    return {
      scannerActive: false,
      jsonData: null
    }
  },
  computed: {
    formattedJsonData() {
      return JSON.stringify(this.jsonData, null, 2);
    }
  },
  methods: {
    showScanner() {
      console.log('Scanner activated'); // Debugging log
      this.scannerActive = true;
    },
    handleJsonExtracted(data) {
      console.log('Extracted QR code data:', data); // Debugging log
      try {
        this.jsonData = JSON.parse(data); // Parse JSON data if valid
      } catch (error) {
        this.jsonData = {error: 'Invalid JSON'}; // Handle invalid JSON
      }
      this.scannerActive = false; // Hide scanner after extraction
    }
  }
}
</script>

<style scoped>
.json-display {
  margin-top: 20px;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

pre {
  font-size: 1rem;
  line-height: 1.5;
}
</style>
