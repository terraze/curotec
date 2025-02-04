export class ApiError extends Error {
    static readonly SUCCESS_STATUS = 'success' as const
    
    constructor(status: string) {
        super(`API Error: ${status}`)
        this.name = 'ApiError'
    }
} 