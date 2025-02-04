export class ApiError extends Error {
    static readonly SUCCESS_STATUS = 'success' as const
    
    constructor(message: string) {
        super(message)
        this.name = 'ApiError'
    }
} 