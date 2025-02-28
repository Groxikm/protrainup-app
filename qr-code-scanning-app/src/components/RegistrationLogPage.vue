<template>
  <div class="container">
    <label for="userId">User ID:</label>
    <input v-model="userId" id="userId" placeholder="Enter User ID" />
    <button @click="fetchAttempts">Search</button>

    <table v-if="attempts.length" class="attempts-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="attempt in attempts" :key="attempt.id">
          <td>{{ attempt.date }}</td>
          <td>{{ attempt.location }}</td>
        </tr>
      </tbody>
    </table>

    <button v-if="hasMore" @click="fetchMoreAttempts">Load More</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userId: localStorage.getItem('userId') || '',
      attempts: [],
      latestDateId: null,
      hasMore: false,
    };
  },
  methods: {
    async fetchAttempts() {
      if (!this.userId) return;
      localStorage.setItem('userId', this.userId);
      this.attempts = [];
      this.latestDateId = null;
      await this.loadAttempts();
    },
    async fetchMoreAttempts() {
      await this.loadAttempts();
    },
    async loadAttempts() {
      try {
        const response = await axios.get('/api/find-user-reg-attempts', {
          params: {
            id: this.userId,
            limit: 10,
            latest_date_id: this.latestDateId,
          },
        });

        if (response.data.attempts.length) {
          this.attempts = [...this.attempts, ...response.data.attempts];
          this.latestDateId = response.data.latestDateId;
          this.hasMore = response.data.attempts.length === 10;
        } else {
          this.hasMore = false;
        }
      } catch (error) {
        console.error('Error fetching attempts:', error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  text-align: center;
}
.attempts-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.attempts-table th, .attempts-table td {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>
