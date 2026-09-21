<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, BriefcaseBusiness, CalendarDays, Pencil, UserRound } from '@lucide/vue'
import { useEmployeeStore } from '../stores/employeeStore'
import { formatCalendarDate, getEmploymentStatus, getTerminationStatus } from '../utils/date'

const route = useRoute()
const employeeStore = useEmployeeStore()
const employee = computed(() => employeeStore.findById(String(route.params.id)))
const savedMessage = computed(() => route.query.created === 'true' ? 'Employee created successfully.' : route.query.updated === 'true' ? 'Changes saved successfully.' : '')

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}
</script>

<template>
  <main v-if="employee" class="container py-5">
    <RouterLink class="btn btn-link px-0 mb-3 d-inline-flex align-items-center gap-1" to="/"><ArrowLeft :size="16" />Back to employees</RouterLink>
    <div v-if="savedMessage" class="alert alert-success" role="status">{{ savedMessage }}</div>

    <section class="card text-bg-primary shadow-sm mb-3">
      <div class="card-body p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div class="d-flex align-items-center gap-3">
          <span class="badge rounded-circle text-bg-light text-primary fs-5 p-3">{{ initials(employee.fullName) }}</span>
          <div><small class="text-uppercase opacity-75">{{ employee.code }}</small><h1 class="h2 mb-1">{{ employee.fullName }}</h1><p class="mb-0 opacity-75">{{ employee.occupation }} · {{ employee.department }}</p></div>
        </div>
        <RouterLink class="btn btn-light d-inline-flex align-items-center justify-content-center gap-2" :to="`/employees/${employee.id}/edit`"><Pencil :size="16" />Edit employee</RouterLink>
      </div>
    </section>

    <div class="row g-3">
      <div class="col-12 col-lg-6">
        <section class="card h-100 shadow-sm">
          <div class="card-header bg-white d-flex align-items-center gap-2"><UserRound :size="19" class="text-primary" /><h2 class="h5 mb-0">Employee details</h2></div>
          <div class="card-body">
            <dl class="row mb-0">
              <dt class="col-sm-4 text-body-secondary py-2">Full name</dt><dd class="col-sm-8 py-2">{{ employee.fullName }}</dd>
              <dt class="col-sm-4 text-body-secondary py-2">Employee code</dt><dd class="col-sm-8 py-2">{{ employee.code }}</dd>
              <dt class="col-sm-4 text-body-secondary py-2">Occupation</dt><dd class="col-sm-8 py-2">{{ employee.occupation }}</dd>
              <dt class="col-sm-4 text-body-secondary py-2">Department</dt><dd class="col-sm-8 py-2"><span class="badge text-bg-light border">{{ employee.department }}</span></dd>
            </dl>
          </div>
        </section>
      </div>

      <div class="col-12 col-lg-6">
        <section class="card h-100 shadow-sm">
          <div class="card-header bg-white d-flex align-items-center gap-2"><CalendarDays :size="19" class="text-primary" /><h2 class="h5 mb-0">Employment timeline</h2></div>
          <div class="list-group list-group-flush">
            <div class="list-group-item p-3 d-flex align-items-start gap-3">
              <BriefcaseBusiness :size="20" class="text-success mt-1" />
              <div><small class="text-body-secondary d-block">Employment date</small><strong>{{ formatCalendarDate(employee.dateOfEmployment) }}</strong><span class="badge text-bg-success ms-2">{{ getEmploymentStatus(employee.dateOfEmployment) }}</span></div>
            </div>
            <div class="list-group-item p-3 d-flex align-items-start gap-3">
              <CalendarDays :size="20" class="text-warning mt-1" />
              <div><small class="text-body-secondary d-block">Termination date</small><strong>{{ formatCalendarDate(employee.terminationDate) }}</strong><span v-if="getTerminationStatus(employee.terminationDate)" class="badge text-bg-warning ms-2">{{ getTerminationStatus(employee.terminationDate) }}</span><span v-else class="text-body-secondary small ms-2">No end date planned</span></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>

  <main v-else class="container py-5 text-center">
    <h1 class="h2">Employee not found</h1>
    <p class="text-body-secondary">This record may have been removed or the link is incorrect.</p>
    <RouterLink class="btn btn-primary" to="/">Return to employees</RouterLink>
  </main>
</template>
