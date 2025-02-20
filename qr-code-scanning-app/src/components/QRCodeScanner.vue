<template>
  <div class="qr-code-scanner">
    <qrcode-stream @decode="onDecode" @init="onInit" />
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
  name: 'QRCodeScanner',
  components: {
    QrcodeStream
  },
  methods: {
    onDecode(content) {
      try {
        const jsonData = JSON.parse(content);
        this.$emit('json-extracted', jsonData);
      } catch (error) {
        console.error('Invalid JSON:', error);
        alert('Invalid JSON detected in QR code.');
      }
    },
    onInit(promise) {
      promise.then(() => {
        console.log('Camera successfully initialized');
      }).catch(error => {
        console.error('Camera initialization failed:', error);
      });
    }
  }
}
</script>

<style scoped>
.qr-code-scanner {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
</style>
