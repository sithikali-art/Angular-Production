/**
 * Envelope types matching the C# .NET Core API conventions:
 *
 *   public class ApiResponse<T> {
 *     public bool Success { get; set; }
 *     public T Data { get; set; }
 *     public string? Message { get; set; }
 *     public List<ApiError>? Errors { get; set; }
 *   }
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
}

export interface ApiError {
  code: string;
  field?: string;
  description: string;
}

/** Matches C# PagedResult<T> (System.Linq paging conventions). */
export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
