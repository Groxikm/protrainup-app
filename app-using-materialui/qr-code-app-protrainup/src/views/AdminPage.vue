<template>
  <v-container>
    <h2 class="text-center">Manage Users</h2>

    <v-tabs v-model="selectedTab">
      <v-tab to="/admin/create-user">Create User</v-tab>
      <v-tab to="/admin/find-user">Find User</v-tab>
      <v-tab to="/admin/change-user">Update User</v-tab>
      <v-tab to="/admin/scan">Scan User QR</v-tab>
      <v-tab to="/admin/log">Registration Log</v-tab>
    </v-tabs>

    <v-window v-model="selectedTab">
      <v-window-item value="/admin/create-user">
        <CreateUser />
      </v-window-item>
      <v-window-item value="/admin/find-user">
        <FindUser />
      </v-window-item>
      <v-window-item value="/admin/change-user">
        <ChangeUser />
      </v-window-item>
      <v-window-item value="/admin/scan">
        <ScanPage />
      </v-window-item>
      <v-window-item value="/admin/log">
        <RegistrationLogPage />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import CreateUser from './CreateUser.vue';
import FindUser from './FindUser.vue';
import ChangeUser from './ChangeUser.vue';
import ScanPage from './ScanPage.vue';
import RegistrationLogPage from './RegistrationLogPage.vue';

export default {
  components: { CreateUser, FindUser, ChangeUser, ScanPage, RegistrationLogPage },
  setup() {
    const route = useRoute();
    const selectedTab = ref(route.path);

    watch(route, (newRoute) => {
      selectedTab.value = newRoute.path;
    });

    return { selectedTab };
  }
};
</script>
