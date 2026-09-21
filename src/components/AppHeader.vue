<script setup lang="ts"> 
import { useEmployeeStore } from '../stores/employeeStore'
import { RefreshCcw } from '@lucide/vue';
const employeeStore = useEmployeeStore()

function resetData() {
  employeeStore.resetEmployees()
}
</script>

<template>
    <header class="p-3 text-bg-dark">
  <div class="container">
    <div
      class="d-flex flex-wrap align-items-center justify-content-between"
    >
      <RouterLink
        to="/"
        class="d-flex align-items-center mb-lg-0 text-white text-decoration-none"
      >
      Purple Cross Ltd
      </RouterLink>

      <div class="text-end">
        <button class="btn btn-secondary" @click="resetData()" type="button"><RefreshCcw :size="16"/>Reload from JSON</button>
        <span>Hello, User</span>
      </div>
    </div>
  </div>
</header>
</template>
