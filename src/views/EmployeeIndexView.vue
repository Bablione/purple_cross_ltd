<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { BriefcaseBusiness, ChevronLeft, ChevronRight, Clock3, Filter, Plus, Search, UserCheck, Users, X } from '@lucide/vue'
import ConfirmDialog from '../components/ApproveDialog.vue'
import EmployeeTable, { type SortDirection, type SortKey } from '../components/EmployeeTable.vue'
import { useEmployeeStore } from '../stores/employeeStore'
import type { Employee } from '../types/employee'
import { getEmployeeLifecycleStatus, getEmploymentStatus, getTerminationStatus } from '../utils/date'

const router = useRouter()
const employeeStore = useEmployeeStore()
const { employees, totalEmployees } = storeToRefs(employeeStore)

// initialise 
const searchTerm = ref('')
const selectedDepartment = ref('all')
const sortKey = ref<SortKey>('fullName')
const sortDirection = ref<SortDirection>('asc')
const currentPage = ref(1)
const pageSize = ref(10)
const employeeToDelete = ref<Employee | null>(null)
const announcement = ref('')

// get widgets data values
const departments = computed(() => [...new Set(employees.value.map((employee) => employee.department))].sort())
const activeCount = computed(() =>
  employees.value.filter((employee) =>
    ['Currently employed', 'To be terminated'].includes(
      getEmployeeLifecycleStatus(
        employee.dateOfEmployment,
        employee.terminationDate
      )
    )
  ).length
)
const upcomingCount = computed(() => employees.value.filter((employee) => getEmploymentStatus(employee.dateOfEmployment) === 'Employed soon').length)
const departureCount = computed(() => employees.value.filter((employee) => getTerminationStatus(employee.terminationDate) === 'To be terminated').length)

const filteredEmployees = computed(() => {
  const query = searchTerm.value.trim().toLocaleLowerCase()
  return employees.value.filter((employee) => {
    const matchesDepartment = selectedDepartment.value === 'all' || employee.department === selectedDepartment.value
    const matchesSearch = !query || [employee.fullName, employee.code, employee.occupation, employee.department].some((value) => value.toLocaleLowerCase().includes(query))
    return matchesDepartment && matchesSearch
  })
})

const sortedEmployees = computed(() => [...filteredEmployees.value].sort((a, b) => {
  const aValue = a[sortKey.value] ?? ''
  const bValue = b[sortKey.value] ?? ''
  const comparison = aValue.localeCompare(bValue, undefined, { sensitivity: 'base' })
  return sortDirection.value === 'asc' ? comparison : -comparison
}))

const totalPages = computed(() => Math.max(1, Math.ceil(sortedEmployees.value.length / pageSize.value)))
const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedEmployees.value.slice(start, start + pageSize.value)
})
const rangeStart = computed(() => (sortedEmployees.value.length ? (currentPage.value - 1) * pageSize.value + 1 : 0))
const rangeEnd = computed(() => Math.min(currentPage.value * pageSize.value, sortedEmployees.value.length))

watch([searchTerm, selectedDepartment, pageSize], () => { currentPage.value = 1 })
watch(totalPages, (pages) => { if (currentPage.value > pages) currentPage.value = pages })

function changeSort(key: SortKey) {
  if (sortKey.value === key) sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = key; sortDirection.value = 'asc' }
  currentPage.value = 1
}

function clearFilters() {
  searchTerm.value = ''
  selectedDepartment.value = 'all'
}

function confirmDelete() {
  if (!employeeToDelete.value) return
  const name = employeeToDelete.value.fullName
  employeeStore.deleteEmployee(employeeToDelete.value.id)
  employeeToDelete.value = null
  announcement.value = `${name} was deleted.`
  window.setTimeout(() => (announcement.value = ''), 3500)
}
</script>

<template>
  <main>
    <section class="bg-primary text-white py-5">
      <div class="container py-3">
        <h1 class="display-5 fw-bold">Employee management</h1>
        <p class="lead mb-0">A clear view of everyone in the system.</p>
      </div>
    </section>


    <!-- Widgets area compared to info available  -->
    <div class="container py-4 pb-5">
    <section class="row g-3 mb-4" aria-label="Workforce summary">
        <div class="col-6 col-lg-3">
          <article class="card h-100 shadow-sm">
                <div class="card-body d-flex align-items-center gap-3">
                    <span class="text-primary"><Users :size="28" /></span>
                    <div>
                        <strong class="fs-4 d-block">{{ totalEmployees }}</strong>
                        <span class="small text-body-secondary">Total employees</span>
                    </div>
                </div>
            </article>
        </div>
        <div class="col-6 col-lg-3">
            <article class="card h-100 shadow-sm">
                <div class="card-body d-flex align-items-center gap-3">
                    <span class="text-success"><UserCheck :size="28" /></span>
                    <div>
                        <strong class="fs-4 d-block">{{ activeCount }}</strong>
                        <span class="small text-body-secondary">Currently active</span>
                    </div>
                </div>
            </article>
        </div>
        <div class="col-6 col-lg-3">
            <article class="card h-100 shadow-sm">
                <div class="card-body d-flex align-items-center gap-3">
                    <span class="text-info"><BriefcaseBusiness :size="28" /></span>
                    <div>
                        <strong class="fs-4 d-block">{{ upcomingCount }}</strong>
                        <span class="small text-body-secondary">Starting soon</span>
                    </div>
                </div>
            </article>
        </div>
        <div class="col-6 col-lg-3">
            <article class="card h-100 shadow-sm">
                <div class="card-body d-flex align-items-center gap-3">
                    <span class="text-warning"><Clock3 :size="28" /></span>
                    <div><strong class="fs-4 d-block">{{ departureCount }}</strong>
                        <span class="small text-body-secondary">Upcoming departures</span>
                    </div>
                </div>
            </article>
        </div>
    </section>

      <section class="card shadow-sm">
        <div class="card-header bg-white p-4">
          <div class="d-flex align-items-start justify-content-between gap-3 mb-3">
            <div><h2 class="h5 mb-1">Team directory</h2><p class="text-body-secondary small mb-0">Search, review and manage employee records.</p></div>
            <span class="badge text-bg-primary rounded-pill">{{ filteredEmployees.length }} records</span>
          </div>

          <div class="row g-2">
            <div class="col-12 col-md-6">
              <label class="input-group">
                <span class="input-group-text"><Search :size="18" /><span class="visually-hidden">Search employees</span></span>
                <input v-model="searchTerm" class="form-control" type="search" placeholder="Search by name, code, role…" aria-label="Search employees" />
                <button v-if="searchTerm" class="btn btn-outline-secondary" type="button" aria-label="Clear search" @click="searchTerm = ''"><X :size="16" /></button>
              </label>
            </div>
            <div class="col-12 col-md-4">
              <label class="input-group">
                <span class="input-group-text"><Filter :size="17" /><span class="visually-hidden">Filter by department</span></span>
                <select v-model="selectedDepartment" class="form-select" aria-label="Filter by department">
                  <option value="all">All departments</option>
                  <option v-for="department in departments" :key="department" :value="department">{{ department }}</option>
                </select>
              </label>
            </div>
            
            <div v-if="searchTerm || selectedDepartment !== 'all'" class="col-auto">
              <button class="btn btn-link" type="button" @click="clearFilters">Clear filters</button>
            </div>
          </div>
        </div>

        <EmployeeTable :employees="paginatedEmployees" :sort-key="sortKey" :sort-direction="sortDirection" @sort="changeSort" @delete="employeeToDelete = $event" />

        <footer v-if="filteredEmployees.length" class="card-footer bg-white d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 p-3">
          <p class="small text-body-secondary mb-0">Showing <strong>{{ rangeStart }}–{{ rangeEnd }}</strong> of <strong>{{ filteredEmployees.length }}</strong></p>
          <div class="d-flex align-items-center gap-2">
            <label class="d-flex align-items-center gap-2 small"><span>Rows</span><select v-model="pageSize" class="form-select form-select-sm"><option :value="10">10</option><option :value="20">20</option><option :value="50">50</option></select></label>
            <span class="small text-body-secondary d-none d-sm-inline">Page {{ currentPage }} of {{ totalPages }}</span>
            <button class="btn btn-sm btn-outline-secondary" type="button" :disabled="currentPage === 1" aria-label="Previous page" @click="currentPage--"><ChevronLeft :size="18" /></button>
            <button class="btn btn-sm btn-outline-secondary" type="button" :disabled="currentPage === totalPages" aria-label="Next page" @click="currentPage++"><ChevronRight :size="18" /></button>
          </div>
        </footer>
      </section>
    </div>

    <div class="toast-container position-fixed bottom-0 end-0 p-3 mb-5">
      <div v-if="announcement" class="toast show text-bg-dark" role="status"><div class="toast-body">{{ announcement }}</div></div>
    </div>

    
   <button class="btn btn-primary shadow position-fixed bottom-0 end-0 m-3" type="button" aria-label="Create Employee" @click="router.push('/employees/new')" ><Plus :size="16" />New Employee</button>
    

    <ConfirmDialog v-if="employeeToDelete" :title="`Delete ${employeeToDelete.fullName}?`" description="This action cannot be undone. The employee record will be permanently removed." @cancel="employeeToDelete = null" @confirm="confirmDelete" />
  </main>
</template>