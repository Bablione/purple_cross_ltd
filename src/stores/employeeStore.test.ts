// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useEmployeeStore } from './employeeStore'
import type { EmployeeInput } from '../types/employee'

const newEmployee: EmployeeInput = {
  code: 'EMP051',
  fullName: 'Jane Doe',
  occupation: 'Backend Developer',
  department: 'IT',
  dateOfEmployment: '2026-09-21',
  terminationDate: null,
}

describe('employee store', () => {
  beforeEach(() => {
    // Clean and rerun store between each test
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('loads the JSON employee data', () => {
    const store = useEmployeeStore()
    expect(store.employees).toHaveLength(50)
  })

  it('checks uniqueness and case sensitivity', () => {

    const store = useEmployeeStore()
    expect(store.isCodeUnique('EMP001')).toBe(false)
    expect(store.isCodeUnique('emp001')).toBe(false)
    expect(store.isCodeUnique('EMP051')).toBe(true)
  })

  it('Existing employee to keep valid code', () => {

    const store = useEmployeeStore()
    const employee = store.employees[0]
    expect(
      store.isCodeUnique(employee.code, employee.id),
    ).toBe(true)
  })

  it('creates an employee', () => {

    const store = useEmployeeStore()
    const employee = store.addEmployee(newEmployee)
    expect(store.employees).toHaveLength(51)
    expect(employee.code).toBe('EMP051')
    expect(store.findById(employee.id)).toEqual(employee)
  })

  it('updates an employee', () => {

    const store = useEmployeeStore()
    const employee = store.addEmployee(newEmployee)
    const updated = store.updateEmployee(employee.id, {
      ...newEmployee,
      occupation: 'Frontend Developer',
    })
    expect(updated).toBe(true)
    expect(store.findById(employee.id)?.occupation)
      .toBe('Frontend Developer')
  })

  it('deletes an employee', () => {

    const store = useEmployeeStore()
    const employee = store.addEmployee(newEmployee)
    const deleted = store.deleteEmployee(employee.id)
    expect(deleted).toBe(true)
    expect(store.findById(employee.id)).toBeUndefined()
  })

  it('persists employee changes to local storage', async () => {

    // Add employee and find it in local storage
    const store = useEmployeeStore()
    store.addEmployee(newEmployee)
    await nextTick()
    const saved = JSON.parse(
      localStorage.getItem('purple_cross_ltd') ?? '[]',
    )
    expect(
      saved.some(
        (employee: EmployeeInput) =>
          employee.code === 'EMP051',
      ),
    ).toBe(true)
  })

  it('resets employees to the original JSON data', () => {
  
    const store = useEmployeeStore()
    store.addEmployee(newEmployee)
    expect(store.employees).toHaveLength(51)
    store.resetEmployees()
    expect(store.employees).toHaveLength(50)
    expect(store.findById('emp051')).toBeUndefined()
  })
})