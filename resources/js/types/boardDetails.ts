export interface TaskStatus {
    id: number
    name: string
    board_id: number
    task_status_id: number
    sort_order: number
    created_at: string | null
    updated_at: string | null
}

export interface Task {
    id: number
    title: string
    description: string
    board_id: number
    task_status_id: number
    assignee_id: number | null
    assignee_name: string | null
    created_by: number
    created_at: string
    updated_at: string
}

export interface BoardDetails {
    id: number
    name: string
    description: string
    created_by: string
    created_at: string
    updated_at: string
    task_status: TaskStatus[]
    tasks: Task[]
}

export interface BoardResponse {
    status: string
    data: BoardDetails
} 