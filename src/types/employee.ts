export interface EmployeeInput {
    code: string
    fullName: string
    occupation: string
    department: string
    dateOfEmployment: string
    terminationDate: string | null
}

// Used for saving the record. Seperates data concern.
export interface Employee extends EmployeeInput {
    id: string
}

export type EmploymentStatus = 'Employed soon' | 'Currently employed'
export type TerminationStatus = 'To be terminated' | 'Terminated' | null
export type EmployeeLifecycleStatus = 'Employed soon' | 'Currently employed' | 'To be terminated' | 'Terminated'
