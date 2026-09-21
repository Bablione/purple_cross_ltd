<script setup lang="ts">
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Pencil, Trash2, UsersRound } from '@lucide/vue'
import type { Employee } from '../types/employee'
import { formatCalendarDate, getEmploymentStatus, getTerminationStatus } from '../utils/date'

export type SortKey = 'fullName' | 'occupation' | 'department' | 'dateOfEmployment' | 'terminationDate'
export type SortDirection = 'asc' | 'desc'

// Input to the component
const props = defineProps<{
  employees: Employee[]
  sortKey: SortKey
  sortDirection: SortDirection
}>()

// Output to the component
const emit = defineEmits<{
  sort: [key: SortKey]
  delete: [employee: Employee]
}>()

function sortIcon(key: SortKey) {
  if (props.sortKey !== key) return ArrowUpDown
  return props.sortDirection === 'asc' ? ArrowUp : ArrowDown
}

function initials(name: string): string {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}
</script>

<template>
  <div v-if="props.employees.length" class="table-responsive">
    <table class="table table-hover align-middle mb-0 text-nowrap">
      <thead class="table-light">
        <tr>
          <th scope="col">
            <button class="btn btn-sm fw-semibold p-0" type="button" @click="emit('sort', 'fullName')">
                Employee <component :is="sortIcon('fullName')" :size="14" />
            </button>
            </th>
            <th scope="col">
                <button class="btn btn-sm fw-semibold p-0" type="button" @click="emit('sort', 'occupation')">
                    Role <component :is="sortIcon('occupation')" :size="14" />
                </button>
            </th>
            <th scope="col">
                <button class="btn btn-sm fw-semibold p-0" type="button" @click="emit('sort', 'department')">
                    Department <component :is="sortIcon('department')" :size="14" />
                </button>
            </th>
            <th scope="col">
                <button class="btn btn-sm fw-semibold p-0" type="button" @click="emit('sort', 'dateOfEmployment')">
                    Employment <component :is="sortIcon('dateOfEmployment')" :size="14" />
                </button>
            </th>
            <th scope="col">
                <button class="btn btn-sm fw-semibold p-0" type="button" @click="emit('sort', 'terminationDate')">
                    Termination <component :is="sortIcon('terminationDate')" :size="14" />
                </button>
            </th>
            <th scope="col" class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in props.employees" :key="employee.id">
          <td>
            <div class="d-flex align-items-center gap-2">
              <span class="badge rounded-circle text-bg-primary d-inline-flex align-items-center justify-content-center p-3">{{ initials(employee.fullName) }}</span>
              <span>
                <RouterLink class="d-block fw-semibold text-decoration-none" :to="`/employees/${employee.id}`">{{ employee.fullName }}</RouterLink>
                <small class="text-body-secondary">{{ employee.code }}</small>
              </span>
            </div>
          </td>
          <td>{{ employee.occupation }}</td>
          <td><span class="badge text-bg-light border">{{ employee.department }}</span></td>
          <td>
            <span class="d-block">{{ formatCalendarDate(employee.dateOfEmployment) }}</span>
            <small :class="getEmploymentStatus(employee.dateOfEmployment) === 'Employed soon' ? 'text-primary' : 'text-success'">{{ getEmploymentStatus(employee.dateOfEmployment) }}</small>
          </td>
          <td>
            <span class="d-block">{{ formatCalendarDate(employee.terminationDate) }}</span>
            <small v-if="getTerminationStatus(employee.terminationDate)" :class="getTerminationStatus(employee.terminationDate) === 'Terminated' ? 'text-danger' : 'text-warning-emphasis'">{{ getTerminationStatus(employee.terminationDate) }}</small>
            <small v-else class="text-body-tertiary">No end date</small>
          </td>
          <td>
            <div class="btn-group float-end" role="group" :aria-label="`Actions for ${employee.fullName}`">
              <RouterLink class="btn btn-sm btn-outline-secondary" :to="`/employees/${employee.id}`" :aria-label="`View ${employee.fullName}`" title="View"><Eye :size="16" /></RouterLink>
              <RouterLink class="btn btn-sm btn-outline-secondary" :to="`/employees/${employee.id}/edit`" :aria-label="`Edit ${employee.fullName}`" title="Edit"><Pencil :size="16" /></RouterLink>
              <button class="btn btn-sm btn-outline-danger" type="button" :aria-label="`Delete ${employee.fullName}`" title="Delete" @click="emit('delete', employee)"><Trash2 :size="16" /></button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="text-center py-5">
    <UsersRound :size="48" class="text-body-tertiary mb-3" />
    <h3 class="h5">No employees found</h3>
    <p class="text-body-secondary mb-0">Try adjusting search filters.</p>
  </div>
</template>