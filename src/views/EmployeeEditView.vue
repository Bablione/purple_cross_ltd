<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import EmployeeForm from '../components/EmployeeForm.vue'
import { useEmployeeStore } from '../stores/employeeStore'
import type { EmployeeInput } from '../types/employee'

const route = useRoute()
const router = useRouter()
const employeeStore = useEmployeeStore()
const employee = computed(() => employeeStore.findById(String(route.params.id)))

function saveEmployee(input: EmployeeInput) {
  if (!employee.value) return
  employeeStore.updateEmployee(employee.value.id, input)
  router.push({ name: 'employee-details', params: { id: employee.value.id }, query: { updated: 'true' } })
}
</script>

<template>
  <main v-if="employee" class="container py-5">
    <RouterLink class="btn btn-link px-0 mb-3 d-inline-flex align-items-center gap-1" :to="`/employees/${employee.id}`"><ArrowLeft :size="16" />Back to employee</RouterLink>
    <header class="mb-4">
      <p class="text-primary text-uppercase small fw-semibold mb-1">{{ employee.code }}</p>
      <h1 class="h2">Edit {{ employee.fullName }}</h1>
      <p class="text-body-secondary">Update this employee’s profile and employment details.</p>
    </header>
    <EmployeeForm :employee="employee" submit-label="Save changes" @save="saveEmployee" @cancel="router.push(`/employees/${employee.id}`)" />
  </main>
  <main v-else class="container py-5 text-center">
    <h1 class="h2">Employee not found</h1>
    <p class="text-body-secondary">This record may have been removed.</p>
    <RouterLink class="btn btn-primary" to="/">Return to employees</RouterLink>
  </main>
</template>