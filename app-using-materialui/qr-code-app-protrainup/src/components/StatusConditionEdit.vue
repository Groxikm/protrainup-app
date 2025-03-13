<template>
  <div>
    <h2>Change Status Rules</h2>
    <form @submit.prevent="changeRules">
      <p><strong>Days scope:</strong> </p>
      <input v-model="query.days_scope" placeholder="rules.days_scope" required />
      <p><strong>Accepted Attendance %</strong> </p>
      <input v-model="query.attendance" placeholder="rules.attendance" required />
      <p><strong>Limit of unpaid months:</strong> </p>
      <input v-model="query.backlog_limit" placeholder="rules.backlog_limit" required />
    </form>
    <button @click=changeRules>Update Rules</button>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import {changeUserStatusRules} from "../api/adminPUTService.js";
import {findRules} from "../api/adminGETService.js";
import {formatInput} from "../utils/formatInput.js";

export default {
  data() {
    return {
      query: {
        days_scope: '',
        attendance: '',
        backlog_limit: '',
      },
      rules: {},
      errorMessage: ''
    };
  },
  async mounted() {
    try {
      this.rules = await findRules();
      this.query.days_scope = this.rules.days_scope || '';
      this.query.attendance = this.rules.attendance || '';
      this.query.backlog_limit = this.rules.backlog_limit || '';
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async changeRules() {

      try {
        const jsonData = {
          "days_scope": formatInput((this.query.days_scope).toString(), 0, 1024),
          "attendance": formatInput((this.query.attendance).toString(), 0, 100),
          "backlog_limit": formatInput((this.query.backlog_limit).toString(), 0, 30),
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