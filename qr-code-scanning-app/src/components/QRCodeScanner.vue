<template>
  <div class="qr-code-scanner">
    <qrcode-stream @detect="onDetect" @error="onError"></qrcode-stream>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader';

export default {
  name: 'QRCodeScanner',
  components: {
    QrcodeStream
  },
  methods: {
    onDetect(detectedCodes) {
      detectedCodes.forEach((code) => {
        console.log('Detected QR code content:', code.rawValue);
        alert('Detected QR code content: ' + code.rawValue); // for debugging
        this.$emit('json-extracted', code.rawValue);
      });
    },
    onError(error) {
      console.error('QR code scanning error:', error);
      alert('Error scanning QR code: ' + error.message);
    }
  }
};
</script>

<style scoped>
.qr-code-scanner {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
</style>
