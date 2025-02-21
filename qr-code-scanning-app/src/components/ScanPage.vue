<template>
  <div class="scan-page">
    <h2>Find User</h2>

    <!-- Manual ID Input -->
    <form @submit.prevent="findUser">
      <input v-model="query.id" placeholder="Enter User ID" required />
      <button type="submit">Search</button>
    </form>

    <!-- QR Code Scanner -->
    <div v-if="scannerActive" class="camera-box">
      <QRCodeScanner @json-extracted="handleJsonExtracted" />
    </div>

    <!-- User Card Display -->
    <div v-if="user" class="user-card">
      <h3>{{ user.name }} {{ user.surname }}</h3>
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Login:</strong> {{ user.login }}</p>
      <p><strong>Visit Frequency:</strong> {{ user.visit_frequency }}</p>
      <p><strong>Valid Until:</strong> {{ user.valid_due }}</p>
    </div>

    <!-- Error Message Display -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import QRCodeScanner from "./QRCodeScanner.vue";
import { API_URL } from "../settings";

export default {
  components: {
    QRCodeScanner,
  },
  data() {
    return {
      query: { id: "" },
      user: null,
      errorMessage: "",
      scannerActive: true,
    };
  },
  methods: {
    async findUser() {
      this.errorMessage = "";
      this.user = null;
      console.log("User data received:",this.query.id);
      try {
        const response = await fetch(`${API_URL}/api/find-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({id: this.query.id}),
        });

        if (!response.ok) {
          throw new Error("User not found");
        }

        this.user = await response.json();
      } catch (error) {
        this.errorMessage = error.message || "Error fetching user data";
      }
    },
    handleJsonExtracted(scannedId) {
      console.log("Extracted ID from QR code:", scannedId);
      this.query.id = scannedId;
      this.scannerActive = false;
      this.findUser();
    },
  },
};
</script>

<style scoped>
.scan-page {
  text-align: center;
  max-width: 500px;
  margin: auto;
}

form {
  margin-bottom: 1rem;
  display: flex;
  gap: 10px;
  justify-content: center;
}

input {
  padding: 0.5rem;
  width: 200px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #26a69a;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.camera-box {
  margin-top: 20px;
  padding: 10px;
  border: 2px solid #26a69a;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-card {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 15px;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
