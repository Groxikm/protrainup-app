<template>
  <div class="welcome-page">
    <h2>Welcome, {{ user.name }} {{ user.surname }}!</h2>

    <p>
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
      // Extract user details passed via query parameters.
      user: {
        id: this.$route.query.id || "",
        name: this.$route.query.name || "",
        surname: this.$route.query.surname || "",
        valid_due: this.$route.query.valid_due || "",
      },
    };
  },
  computed: {
    // Convert the valid_due string from format "dd/mm/yy HH:MM:SS" into a Date object.
    parsedValidDue() {
      if (!this.user.valid_due) return null;
      const parts = this.user.valid_due.split(" ");
      if (parts.length < 2) return null;
      const dateParts = parts[0].split("/");
      const timeParts = parts[1].split(":");
      if (dateParts.length !== 3 || timeParts.length !== 3) return null;

      // Extract day, month, and year (assume two-digit years belong to the 2000s)
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      let year = parseInt(dateParts[2], 10);
      if (year < 100) { // Adjust two-digit year
        year += 2000;
      }
      const hour = parseInt(timeParts[0], 10);
      const minute = parseInt(timeParts[1], 10);
      const second = parseInt(timeParts[2], 10);
      return new Date(year, month, day, hour, minute, second);
    },
    // Determine if the valid due date is in the past.
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
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}

.welcome-page h2 {
  font-size: 32px;
  color: #26a69a;
  margin-bottom: 10px;
}

.welcome-page p {
  font-size: 18px;
  margin-bottom: 20px;
}

/* If the valid_until date is expired, show red text; otherwise, green */
.expired {
  color: red;
  font-weight: bold;
}

.valid {
  color: green;
  font-weight: bold;
}

.qr-code-container {
  margin-top: 30px;
}
</style>