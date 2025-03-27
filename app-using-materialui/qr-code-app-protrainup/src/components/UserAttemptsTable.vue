<template>
  <div>
    <div class="logs-header">
      <h2>Latest Registration Attempts</h2>
    </div>

    <div class="logs-table-container">
      <table class="logs-table">
        <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Status</th>
          <th>Location</th>
          <th>Avatar</th>
          <th>Name</th>
          <th>Surname</th>
          <th>Team</th>
          <th>Club</th>
          <th>Attendance</th>
          <th>Unpaid months</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(log, index) in logs" :key="log.id">
          <td>{{ index + 1 }}</td>
          <td>{{ log.date }}</td>
          <td>
            <span :class="getStatusClass(log.status)">{{ log.status }}</span>
          </td>
          <td>{{ log.location }}</td>
          <td class="avatar-cell">
            <img v-if="log.userData" :src="formatAvatar(log.userData.avatar_link)" alt="Avatar" width="32" height="32">
            <img v-if="log.userData" :src="formatClub(log.userData.club_link)" alt="Club" width="32" height="32" class="club-icon">
            <div v-if="!log.userData" class="loading-avatar">Loading...</div>
          </td>
          <td>{{ log.userData ? log.userData.name : 'Loading...' }}</td>
          <td>{{ log.userData ? log.userData.surname : 'Loading...' }}</td>
          <td>{{ log.userData ? log.userData.team : 'Loading...' }}</td>
          <td>{{ log.userData ? log.userData.club : 'Loading...' }}</td>
          <td>{{ log.userData ? `${log.userData.visit_frequency} %` : 'Loading...' }}</td>
          <td>{{ log.userData ? log.userData.backlog : 'Loading...' }}</td>
        </tr>
        </tbody>
      </table>

      <div class="pagination-controls">
        <button @click="loadMoreLogs" class="load-more-button" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Load More' }}
        </button>
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import { findAllRegAttempts } from "../api/adminGETService.js";
import { findUserById } from "../api/adminGETService.js";

export default {
  data() {
    return {
      logs: [],
      lastLogDate: null,
      isLoading: false,
      errorMessage: "",
      userCache: {}
    };
  },
  async mounted() {
    await this.loadMoreLogs();
  },
  methods: {
    async loadMoreLogs() {
      try {
        this.isLoading = true;
        this.errorMessage = "";

        const data = await findAllRegAttempts(this.lastLogDate);
        this.lastLogDate = data.latestDate;

        // Creating log entries with placeholders for user data
        const logEntries = data.attempts.map(attempt => ({
          ...attempt,
          userData: null
        }));

        // Add the logs to the list
        this.logs.push(...logEntries);

        // Fetch user data for each log entry
        for (const log of logEntries) {
          await this.fetchUserData(log);
        }

        this.isLoading = false;
      } catch (error) {

        try {
          console.error("Error fetching logs:", error);
        } catch (error) {
          console.log("No more logs loaded");
        }
        this.errorMessage = "No more logs available";
        this.isLoading = false;
      }
    },

    async fetchUserData(log) {
      try {
        // Check if theres already the user in the cache
        if (this.userCache[log.user_id]) {
          log.userData = this.userCache[log.user_id];
          return;
        }

        // Fetch user data
        const userData = await findUserById(log.user_id);

        // Store in cache
        this.userCache[log.user_id] = userData;

        // Update log with user data
        log.userData = userData;
      } catch (error) {
        console.error(`Error fetching user data for log ${log.id}:`, error);
      }
    },

    formatAvatar(avatarLink) {
      return avatarLink && typeof avatarLink === 'string' ? avatarLink : 'https://via.placeholderA.com/32';
    },

    formatClub(clubLink) {
      return clubLink && typeof clubLink === 'string' ? clubLink : 'https://via.placeholderB.com/32';
    },

    getStatusClass(status) {
      // Extract the color from the status string (e.g., "Orange f" -> "orange")
      const statusLower = status.toLowerCase();

      if (statusLower.includes('green')) return 'status-green';
      if (statusLower.includes('orange f') || statusLower.includes('orange b')) return 'status-orange';
      if (statusLower.includes('red')) return 'status-red';
      if (statusLower.includes('yellow')) return 'status-yellow';
      return 'status-default';
    }
  }
};
</script>

<style scoped>
/* Header styles */
.logs-header {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

.logs-header h2 {
  margin-top: 0;
  color: #333;
  padding-bottom: 10px;
}

/* Table styles */
.logs-table-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  overflow-x: auto;
}

.logs-table {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;
}

.logs-table th,
.logs-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.logs-table th {
  background-color: #f4f4f4;
  font-weight: 600;
}

.logs-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.logs-table tr:hover {
  background-color: #f1f1f1;
}

/* Avatar cell styles */
.avatar-cell {
  display: flex;
  align-items: center;
  gap: 5px;
}

.club-icon {
  margin-left: 5px;
}

.loading-avatar {
  font-style: italic;
  color: #888;
  font-size: 0.9em;
}

/* Status styles */
.status-green {
  color: #4CAF50;
  font-weight: bold;
}

.status-orange {
  color: #FF9800;
  font-weight: bold;
}

.status-red {
  color: #F44336;
  font-weight: bold;
}

.status-yellow {
  color: #FFEB3B;
  font-weight: bold;
}

.status-default {
  color: #757575;
  font-weight: bold;
}

/* Pagination controls */
.pagination-controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.load-more-button {
  background-color: #2196f3;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.load-more-button:hover:not(:disabled) {
  background-color: #0b7dda;
}

.load-more-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Error message */
.error-message {
  color: #f44336;
  margin-top: 10px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
  text-align: center;
}
</style>