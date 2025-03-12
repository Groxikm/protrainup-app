<template>
  <div>
    <h2>Change Status Rules</h2>
    <form @submit.prevent="changeRules">
      <input v-model="query.days_scope" placeholder="Days_scope" required />
      <input v-model="query.attendance" placeholder="Attendance %" required />
      <input v-model="query.backlog_limit" placeholder="Limit of unpaid month" required />
    </form>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import {changeUserStatusRules} from "../api/adminPUTService.js";

export default {
  data() {
    return {
      query: {
        days_scope: '',
        attendance: '',
        backlog_limit: '',
      },
      errorMessage: ''
    };
  },
  methods: {
    async changeRules() {
      try {
        const jsonData = {
          "days_scope": this.query.days_scope,
          "attendance": this.query.attendance,
          "backlog_limit": this.query.backlog_limit,
        }
        for (const key in jsonData) {
          if (!jsonData[key]) {
            throw new Error(`Missing value for ${key}`);
          }
        }
        await changeUserStatusRules(jsonData);
      } catch (error) {
        this.errorMessage = error.message || "Error editing conditions";
      }
    },
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  width: 300px;
}

input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  padding: 0.5rem;
  font-size: 1rem;
}

.error-message {
  color: red;
  font-weight: bold;
}
</style>