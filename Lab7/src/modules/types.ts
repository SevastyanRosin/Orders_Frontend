export type T_Unit =  {
    id: number,
    name: string,
    description: string,
    phone: string,
    image: string,
    status: number,
    meeting?: number
}

export type T_Decree = {
    id: string | null
    status: E_DecreeStatus
    date_complete: string
    date_created: string
    date_formation: string
    owner: string
    moderator: string
    units: T_Unit[]
    name: string
    date: string
}

export enum E_DecreeStatus {
    Draft=1,
    InWork,
    Completed,
    Rejected,
    Deleted
}

export type T_User = {
    id: number
    username: string
    is_authenticated: boolean
}

export type T_DecreesFilters = {
    date_formation_start: string
    date_formation_end: string
    status: E_DecreeStatus
}

export type T_UnitsListResponse = {
    units: T_Unit[],
    draft_decree_id: number,
    units_count: number
}

export type T_LoginCredentials = {
    username: string
    password: string
}

export type T_RegisterCredentials = {
    name: string
    email: string
    password: string
}