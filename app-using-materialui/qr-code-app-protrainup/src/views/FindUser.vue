<template>
  <v-container>
    <h2>Find User</h2>
    <v-form @submit.prevent="findUser">
      <v-text-field v-model="query.id" label="ID"></v-text-field>
      <v-text-field v-model="query.name" label="Name"></v-text-field>
      <v-text-field v-model="query.surname" label="Surname"></v-text-field>
      <v-btn type="submit" color="primary">Find User</v-btn>
    </v-form>

    <v-card v-if="user" class="mt-4">
      <v-card-title>{{ user.name }} {{ user.surname }}</v-card-title>
      <v-card-subtitle>{{ user.login }}</v-card-subtitle>
      <v-card-text>
        <p><strong>Password (hashed):</strong> {{ user.password }}</p>
        <p><strong>Visit Frequency:</strong> {{ user.visit_frequency }}</p>
        <p><strong>Valid Until:</strong> {{ user.valid_due }}</p>
      </v-card-text>
    </v-card>

    <v-alert v-if="errorMessage" type="error" class="mt-2">
      {{ errorMessage }}
    </v-alert>
  </v-container>
</template>

<script>
import { API_URL } from '../settings.js';

export default {
  data() {
    return {
      query: { id: '', name: '', surname: '' },
      user: null,
      errorMessage: ''
    };
  },
  methods: {
    async findUser() {
      try {
        const response = await fetch(
          `${API_URL}/api/find-user-by-name-surname?&name=${encodeURIComponent(this.query.name)}&surname=${encodeURIComponent(this.query.surname)}`,
          { method: 'GET', headers: { 'accessToken': localStorage.getItem('acc_token') } }
        );

        if (!response.ok) throw new Error('User not found');

        this.user = await response.json();
        this.errorMessage = '';
      } catch (error) {
        this.user = null;
        this.errorMessage = error.message || 'Error finding user';
      }
    }
  }
}
</script>
