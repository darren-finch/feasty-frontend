export interface RepositoryResponse<T> {
	value: T
	error: Error | null
}
