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
      console.log('Decoded content:', content); // Debugging log
      this.$emit('json-extracted', content); // Emit raw content without parsing
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
