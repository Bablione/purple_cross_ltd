import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import seedEmployees from '../data/employees.json'
import type { Employee, EmployeeInput } from '../types/employee'

const STORAGE_KEY = 'purple_cross_ltd'

// Load the JSON data
function loadEmployees(): Employee[] {
  const fallback = () =>
    createSeedEmployees()

    // Local storage saving
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return fallback()

      const parsed = JSON.parse(saved)

      return Array.isArray(parsed) ? (parsed as Employee[]) : fallback()

    } catch {
      return fallback()
    }
}


function createSeedEmployees(): Employee[] {
  return (structuredClone(seedEmployees) as EmployeeInput[]).map((employee) => ({
    id: employee.code.toLocaleLowerCase(),
    ...employee,
  }))
}

function createId(): string {
  return crypto.randomUUID()
}

export const useEmployeeStore = defineStore('employees', () => {

  const employees = ref<Employee[]>(loadEmployees())
  const totalEmployees = computed(() => employees.value.length)

  watch(
    employees,
    (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)),
    { deep: true },
  )

  function findById(id: string): Employee | undefined {
    return employees.value.find((employee) => employee.id === id)
  }

  function resetEmployees() {
    employees.value = createSeedEmployees()
  }

  function isCodeUnique(code: string, excludeIdentifier?: string): boolean {

    const normalized = code.trim().toLocaleLowerCase()

    return !employees.value.some(
        (employee) => 
          employee.id !== excludeIdentifier &&
          employee.code.trim().toLocaleLowerCase() === normalized,
    )
  }

  function addEmployee(input: EmployeeInput): Employee {
    const employee: Employee = { id: createId(), ...input }
    employees.value.unshift(employee)
    return employee
  }

  function updateEmployee(id: string, input: EmployeeInput): boolean {
    const index = employees.value.findIndex((employee) => employee.id === id)
    if (index === -1) return false
    employees.value[index] = { id, ...input }
    return true
  }

  function deleteEmployee(id: string): boolean {
    const index = employees.value.findIndex((employee) => employee.id === id)
    if (index === -1) return false
    employees.value.splice(index, 1)
    return true
  }

  return {
    employees,
    totalEmployees,
    findById,
    isCodeUnique,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    resetEmployees
  }
})