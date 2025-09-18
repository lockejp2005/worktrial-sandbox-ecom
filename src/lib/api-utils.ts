export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return {
      error: error.message,
      code: error.code,
      status: error.statusCode
    };
  }
  
  return {
    error: 'An unexpected error occurred',
    status: 500
  };
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginationResponse {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  return {
    limit: parseInt(searchParams.get('limit') || '10'),
    offset: parseInt(searchParams.get('offset') || '0')
  };
}

export function createPaginationResponse(
  total: number,
  limit: number,
  offset: number
): PaginationResponse {
  return {
    total,
    limit,
    offset,
    hasMore: offset + limit < total
  };
}