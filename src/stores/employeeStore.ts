import seedEmployees from '../data/employees.json'
import type { Employee, EmployeeInput } from '../types/employee'

const STORAGE_KEY = 'purple_cross_ltd'

// Load the JSON data
function loadEmployees(): Employee[] {
  const fallback = () =>
    (structuredClone(seedEmployees) as EmployeeInput[]).map((employee) => ({
      id: `seed-${employee.code.toLocaleLowerCase()}`,
      ...employee,
    }))

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

function createId(): string {
  return crypto.randomUUID()
}

