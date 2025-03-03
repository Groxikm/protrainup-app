<template>
  <div class="welcome-page container" :class="{ expired: isExpired }">
    <div class="header">
      <h2>Welcome, {{ user.name }} {{ user.surname }}!</h2>
    </div>

    <p class="validity">
      <strong>Valid Until: </strong>
      <span :class="{ expired: isExpired, valid: !isExpired }">
        {{ user.valid_due }}
      </span>
    </p>

    <div class="qr-code-container">
      <h3>Your ID as QR Code:</h3>
      <qrcode-vue :value="user.id" :size="200" level="M" />
    </div>

  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";

export default {
  name: "WelcomePage",
  components: {
    QrcodeVue,
  },
  data() {
    return {
      user: {
        id: this.$route.query.id || "",
        name: this.$route.query.name || "",
        surname: this.$route.query.surname || "",
        valid_due: this.$route.query.valid_due || "",
      },
    };
  },
  computed: {
    parsedValidDue() {
      if (!this.user.valid_due) return null;

      // Parse the date string (assuming format: "DD/MM/YYYY HH:mm:ss")
      const [datePart, timePart] = this.user.valid_due.split(" ");
      if (!datePart || !timePart) return null;

      const [day, month, year] = datePart.split("/").map(Number);
      const [hour, minute, second] = timePart.split(":").map(Number);

      // Create a Date object (month is 0-based in JavaScript)
      return new Date(year, month - 1, day, hour, minute, second);
    },
    isExpired() {
      if (!this.parsedValidDue) return false;
      const now = new Date();
      return now > this.parsedValidDue;
    },
  },
};
</script>

<style scoped>
.welcome-page {
  text-align: center;
  max-width: 800px;
  margin: 40px auto;
  background-color: #f5f5f5; /* Light background for contrast */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow */
  transition: background-color 0.3s; /* Smooth transition */
}

.header h2 {
  font-size: 32px;
  color: #26a69a;
  margin-bottom: 15px; /* Spacing for better separation */
}

.validity {
  font-size: 18px;
  margin-bottom: 20px;
}

.qr-code-container {
  margin-top: 30px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background-color: white; /* Contrasting background for QR code area */
}

.footer-note {
  margin-top: 30px;
}

.btn-cta-primary {
  background-color: #26a69a;
  border: 2px solid #26a69a;
  color: white;
  padding: 10px 20px;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cta-primary:hover {
  background-color: #e9553b;
  border: 2px solid #e9553b;
  color: white;
}

.expired {
  color: red;
  font-weight: bold;
  background-color: rgba(255, 0, 0, 0.1); /* Light red background */
}

.valid {
  color: green;
  font-weight: bold;
}
</style>