<template>
  <button @click="activateScanner" class="btn">{{ label }}</button>
</template>

<script>
export default {
  name: 'ButtonComponent',
  props: {
    label: {
      type: String,
      default: 'Scan QR Code'
    }
  },
  methods: {
    activateScanner() {
      this.$emit('activate-scanner');
    }
  }
}
</script>

<style scoped>
.btn {
  padding: 10px 20px;
  color: #fff;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn:hover {
  background-color: #2c8f6a;
}
</style>
