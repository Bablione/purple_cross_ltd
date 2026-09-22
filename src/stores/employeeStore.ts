import { computed, ref } from 'vue'
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
  const saveMessage = ref()


  function persistingEmployees(nextData: Employee[]): boolean {

    saveMessage.value = ''
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData))
      employees.value = nextData
      return true
    } catch {
      saveMessage.value = 'Changes could not be saved in browser. Try again'
      return false
    }
  }

  function findById(id: string): Employee | undefined {
    return employees.value.find((employee) => employee.id === id)
  }

  function resetEmployees() {
    return persistingEmployees(createSeedEmployees())
  }

  function isCodeUnique(code: string, excludeIdentifier?: string): boolean {

    const normalized = code.trim().toLocaleLowerCase()

    return !employees.value.some(
        (employee) => 
          employee.id !== excludeIdentifier &&
          employee.code.trim().toLocaleLowerCase() === normalized,
    )
  }

  function addEmployee(input: EmployeeInput): Employee | null {
    const employee: Employee = { id: createId(), ...input }
    
    return persistingEmployees([employee, ...employees.value]) ? employee : null
  }

  function updateEmployee(id: string, input: EmployeeInput): boolean {
    if (!findById(id)) return false

    return persistingEmployees(
      employees.value.map((employee) => employee.id === id ? { id, ...input } : employee)
    )
  }

  function deleteEmployee(id: string): boolean {
    if (!findById(id)) return false

     return persistingEmployees(
      employees.value.filter((employee) => employee.id !== id)
    )
  }

  return {
    employees,
    saveMessage,
    totalEmployees,
    findById,
    isCodeUnique,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    resetEmployees
  }
})