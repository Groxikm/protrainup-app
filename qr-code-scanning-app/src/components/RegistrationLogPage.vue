<template>
  <div>
    <input v-model="userId" placeholder="Enter user ID" @change="resetData" />
    <table>
      <thead>
        <tr>
          <th>Registration Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="attempt in attempts" :key="attempt.id">
          <td>{{ attempt.registration_date }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="loadMore" v-if="hasMore">Load More</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userId: '',
      attempts: [],
      latestDateId: null,
      hasMore: true,
    };
  },
  methods: {
    async fetchAttempts() {
      if (!this.userId) return;
      try {
        const response = await axios.get(`/api/user-attempts`, {
          params: { user_id: this.userId, latest_date_id: this.latestDateId }
        });
        if (response.data.length < 10) {
          this.hasMore = false;
        }
        if (response.data.length > 0) {
          this.latestDateId = response.data[response.data.length - 1].id;
          this.attempts.push(...response.data);
        }
      } catch (error) {
        console.error("Error fetching attempts:", error);
      }
    },
    loadMore() {
      this.fetchAttempts();
    },
    resetData() {
      this.attempts = [];
      this.latestDateId = null;
      this.hasMore = true;
      this.fetchAttempts();
    }
  }
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
