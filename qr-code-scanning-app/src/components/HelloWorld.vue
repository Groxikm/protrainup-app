<template>
  <div class="hello">
    <ButtonComponent label="Scan QR Code" @activate-scanner="showScanner" />
    <QRCodeScanner v-if="scannerActive" @json-extracted="handleJsonExtracted" />
    <pre>{{ jsonData }}</pre>
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
  methods: {
    showScanner() {
      this.scannerActive = true;
    },
    handleJsonExtracted(data) {
      this.jsonData = data;
      this.scannerActive = false;
    }
  }
}
</script>

<style scoped>
/* Additional styling if needed */
</style>
