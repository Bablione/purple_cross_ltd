<script setup lang="ts">
import { reactive, ref } from 'vue'
import { CalendarDays, Check, UserRound } from '@lucide/vue'
import { useEmployeeStore } from '../stores/employeeStore'
import type { Employee, EmployeeInput } from '../types/employee'
import { parseCalendarDate } from '../utils/date'

const props = defineProps<{ employee?: Employee; submitLabel: string }>()
const emit = defineEmits<{ save: [employee: EmployeeInput]; cancel: [] }>()

type FormKey = keyof EmployeeInput
type FormErrors = Partial<Record<FormKey, string>>

const employeeStore = useEmployeeStore()
const errors = reactive<FormErrors>({})
const form = reactive<EmployeeInput>({
  code: props.employee?.code ?? '',
  fullName: props.employee?.fullName ?? '',
  occupation: props.employee?.occupation ?? '',
  department: props.employee?.department ?? '',
  dateOfEmployment: props.employee?.dateOfEmployment ?? '',
  terminationDate: props.employee?.terminationDate ?? null,
})

function validateField(field: FormKey): string | undefined {
  const rawValue = form[field]
  const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue

  switch (field) {
    case 'code':
      if (!value) return 'Employee code is required.'
      if (!employeeStore.isCodeUnique(String(value), props.employee?.id)) return 'This employee code is already in use.'
      break
    case 'fullName':
      if (!value) return 'Full name is required.'
      if (String(value).length < 3) return 'Full name must be at least 3 characters.'
      break
    case 'occupation':
      if (!value) return 'Occupation is required.'
      break
    case 'department':
      if (!value) return 'Department is required.'
      break
    case 'dateOfEmployment':
      if (!value) return 'Employment date is required.'
      if (!parseCalendarDate(String(value))) return 'Enter a valid employment date.'
      break
    case 'terminationDate': {
      if (value && !parseCalendarDate(String(value))) return 'Enter a valid termination date.'
      const employment = parseCalendarDate(form.dateOfEmployment)
      const termination = value ? parseCalendarDate(String(value)) : null
      if (employment && termination && termination < employment) return 'Termination date cannot be before employment date.'
      break
    }
  }
  return undefined
}

function validateAndSet(field: FormKey) {
  const message = validateField(field)
  if (message) errors[field] = message
  else delete errors[field]
  if (field === 'dateOfEmployment' && form.terminationDate) validateAndSet('terminationDate')
}

function validateForm(): boolean {
  const fields: FormKey[] = ['code', 'fullName', 'occupation', 'department', 'dateOfEmployment', 'terminationDate']
  fields.forEach(validateAndSet)
  return Object.keys(errors).length === 0
}

function submit() {
  if (!validateForm()) {
    requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
    return
  }
  emit('save', {
    code: form.code.trim(),
    fullName: form.fullName.trim(),
    occupation: form.occupation.trim(),
    department: form.department.trim(),
    dateOfEmployment: form.dateOfEmployment,
    terminationDate: form.terminationDate || null,
  })
}
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <section class="card shadow-sm mb-3">
      <div class="card-header bg-white p-3 d-flex align-items-center gap-2">
        <UserRound :size="20" class="text-primary" />
        <div><h2 class="h5 mb-0">Employee information</h2><p class="small text-body-secondary mb-0">The core details used to identify this employee.</p></div>
      </div>
      <div class="card-body p-4">
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label class="form-label fw-semibold" for="code">Employee code <span class="text-danger">*</span></label>
            <input id="code" v-model="form.code" class="form-control" :class="{ 'is-invalid': errors.code }" type="text" autocomplete="off" placeholder="e.g. EMP051" :aria-invalid="!!errors.code" @blur="validateAndSet('code')" />
            <div v-if="errors.code" class="invalid-feedback">{{ errors.code }}</div>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label fw-semibold" for="fullName">Full name <span class="text-danger">*</span></label>
            <input id="fullName" v-model="form.fullName" class="form-control" :class="{ 'is-invalid': errors.fullName }" type="text" autocomplete="name" placeholder="e.g. Alex Morgan" :aria-invalid="!!errors.fullName" @blur="validateAndSet('fullName')" />
            <div v-if="errors.fullName" class="invalid-feedback">{{ errors.fullName }}</div>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label fw-semibold" for="occupation">Occupation <span class="text-danger">*</span></label>
            <input id="occupation" v-model="form.occupation" class="form-control" :class="{ 'is-invalid': errors.occupation }" type="text" placeholder="e.g. Research Scientist" :aria-invalid="!!errors.occupation" @blur="validateAndSet('occupation')" />
            <div v-if="errors.occupation" class="invalid-feedback">{{ errors.occupation }}</div>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label fw-semibold" for="department">Department <span class="text-danger">*</span></label>
            <input id="department" v-model="form.department" class="form-control" :class="{ 'is-invalid': errors.department }" type="text" list="department-options" placeholder="e.g. Research" :aria-invalid="!!errors.department" @blur="validateAndSet('department')" />
            <datalist id="department-options"><option value="Finance" /><option value="Human Resources" /><option value="IT" /><option value="Logistics" /><option value="Production" /><option value="Quality Assurance" /><option value="Research" /><option value="Sales" /></datalist>
            <div v-if="errors.department" class="invalid-feedback">{{ errors.department }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="card shadow-sm mb-3">
      <div class="card-header bg-white p-3 d-flex align-items-center gap-2">
        <CalendarDays :size="20" class="text-primary" />
        <div><h2 class="h5 mb-0">Employment dates</h2><p class="small text-body-secondary mb-0">Status labels are calculated automatically from these dates.</p></div>
      </div>
      <div class="card-body p-4">
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label class="form-label fw-semibold" for="dateOfEmployment">Employment date <span class="text-danger">*</span></label>
            <input id="dateOfEmployment" v-model="form.dateOfEmployment" class="form-control" :class="{ 'is-invalid': errors.dateOfEmployment }" type="date" :aria-invalid="!!errors.dateOfEmployment" @blur="validateAndSet('dateOfEmployment')" />
            <div v-if="errors.dateOfEmployment" class="invalid-feedback">{{ errors.dateOfEmployment }}</div>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label fw-semibold" for="terminationDate">Termination date</label>
            <input id="terminationDate" v-model="form.terminationDate" class="form-control" :class="{ 'is-invalid': errors.terminationDate }" type="date" :aria-invalid="!!errors.terminationDate" @blur="validateAndSet('terminationDate')" />
            <div v-if="errors.terminationDate" class="invalid-feedback">{{ errors.terminationDate }}</div>
            <div v-else class="form-text">Leave blank if there is no planned end date.</div>
          </div>
        </div>
      </div>
    </section>

    <footer class="card shadow-sm">
      <div class="card-body d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <p class="small text-body-secondary mb-0"><span class="text-danger">*</span> Required fields</p>
        <div class="d-flex gap-2">
          <button class="btn btn-secondary" type="button" @click="emit('cancel')">Cancel</button>
          <button class="btn btn-primary" type="submit"><Check :size="17" /> {{ submitLabel }}</button>
        </div>
      </div>
    </footer>
  </form>
</template>