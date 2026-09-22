<script setup lang="ts"> 

import { ref } from 'vue';
import { useEmployeeStore } from '../stores/employeeStore'
import { useRouter } from 'vue-router';
import { RefreshCcw } from '@lucide/vue';
import ApproveDialog from './ApproveDialog.vue';

const employeeStore = useEmployeeStore()
const router = useRouter()
const showResetModal = ref(false)

function resetData() {
  employeeStore.resetEmployees()
  showResetModal.value = false
  router.push("/")
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
        class="d-flex align-items-center text-white text-decoration-none"
      >
        Purple Cross Ltd
      </RouterLink>

      <div class="d-flex align-items-center gap-3">
        <button
          type="button"
          class="btn btn-secondary d-flex align-items-center"
          @click="showResetModal = true"
        >
          <RefreshCcw :size="16" class="me-2" />
          Reload JSON
        </button>

        <span class="d-flex align-items-center">
          Hello, User
        </span>
      </div>
    </div>
  </div>
</header>

<ApproveDialog
  v-if="showResetModal"
  title="Reset employee data?"
  description="This will remove the local changes and restore the original seeded JSON"
  confirm-label="Reset Data"
  @cancel="showResetModal = false"
  @confirm="resetData"
/>
</template>
