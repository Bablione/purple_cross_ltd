<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
import { useRouter } from 'vue-router'
import EmployeeForm from '../components/EmployeeForm.vue'
import { useEmployeeStore } from '../stores/employeeStore'
import type { EmployeeInput } from '../types/employee'

const router = useRouter()
const employeeStore = useEmployeeStore()

function saveEmployee(input: EmployeeInput) {
  const employee = employeeStore.addEmployee(input)
  router.push({ name: 'employee-details', params: { id: employee.id }, query: { created: 'true' } })
}
</script>

<template>
  <main class="container py-5">
    <RouterLink class="btn btn-link px-0 mb-3 d-inline-flex align-items-center gap-1" to="/"><ArrowLeft :size="16" />Back to employees</RouterLink>
    <header class="mb-4">
      <h1 class="h2">Create employee</h1>
      <p class="text-body-secondary">Add a new colleague to the Purple Cross employee directory.</p>
    </header>
    <EmployeeForm submit-label="Create employee" @save="saveEmployee" @cancel="router.push('/')" />
  </main>
</template>