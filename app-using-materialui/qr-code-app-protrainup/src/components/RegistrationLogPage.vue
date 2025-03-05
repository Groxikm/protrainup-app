<template>
  <div class="container">
    <h2>Registration Attempts</h2>
    <input v-model="userId" placeholder="Enter user ID" @change="resetData" />

    <table class="attempts-table">
      <thead>
      <tr>
        <th>Registration Date</th>
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

    <button @click="loadMore" v-if="hasMore">Load More</button>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '../settings';

export default {
  props: {
    initialUserId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      userId: this.initialUserId, // userId receives initial value from props
      attempts: [],
      latestDateId: null,
      hasMore: true,
    };
  },
  watch: {
    userId(newId, oldId) {
      if (newId !== oldId) {
        this.resetData(); // Reset data whenever the userId changes
      }
    }
  },
  methods: {
    async fetchAttempts() {
      if (!this.userId) return; // Early exit if userId is not set

      try {

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
  },
  mounted() {
    this.fetchAttempts(); // Fetch attempts on initial mount
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