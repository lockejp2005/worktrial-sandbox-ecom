import { describe, it, expect } from '@jest/globals';
import { 
  ApiError, 
  handleApiError, 
  getPaginationParams, 
  createPaginationResponse 
} from '../src/lib/api-utils';

describe('API Utils', () => {
  describe('ApiError', () => {
    it('should create an ApiError with correct properties', () => {
      const error = new ApiError('Test error', 400, 'TEST_ERROR');
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.name).toBe('ApiError');
    });

    it('should be an instance of Error', () => {
      const error = new ApiError('Test error', 500);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('handleApiError', () => {
    it('should handle ApiError correctly', () => {
      const apiError = new ApiError('Bad request', 400, 'BAD_REQUEST');
      const result = handleApiError(apiError);
      
      expect(result).toEqual({
        error: 'Bad request',
        code: 'BAD_REQUEST',
        status: 400
      });
    });

    it('should handle unknown errors', () => {
      const unknownError = new Error('Unknown error');
      const result = handleApiError(unknownError);
      
      expect(result).toEqual({
        error: 'An unexpected error occurred',
        status: 500
      });
    });

    it('should handle non-Error objects', () => {
      const result = handleApiError('string error');
      
      expect(result).toEqual({
        error: 'An unexpected error occurred',
        status: 500
      });
    });
  });

  describe('getPaginationParams', () => {
    it('should return default values when no params provided', () => {
      const searchParams = new URLSearchParams();
      const result = getPaginationParams(searchParams);
      
      expect(result).toEqual({
        limit: 10,
        offset: 0
      });
    });

    it('should parse limit and offset from search params', () => {
      const searchParams = new URLSearchParams('limit=20&offset=40');
      const result = getPaginationParams(searchParams);
      
      expect(result).toEqual({
        limit: 20,
        offset: 40
      });
    });

    it('should handle invalid values', () => {
      const searchParams = new URLSearchParams('limit=invalid&offset=invalid');
      const result = getPaginationParams(searchParams);
      
      expect(result).toEqual({
        limit: 10,
        offset: 0
      });
    });
  });

  describe('createPaginationResponse', () => {
    it('should create correct pagination response', () => {
      const result = createPaginationResponse(100, 10, 0);
      
      expect(result).toEqual({
        total: 100,
        limit: 10,
        offset: 0,
        hasMore: true
      });
    });

    it('should correctly determine hasMore for last page', () => {
      const result = createPaginationResponse(100, 10, 90);
      
      expect(result).toEqual({
        total: 100,
        limit: 10,
        offset: 90,
        hasMore: false
      });
    });

    it('should handle edge case where offset + limit equals total', () => {
      const result = createPaginationResponse(50, 25, 25);
      
      expect(result).toEqual({
        total: 50,
        limit: 25,
        offset: 25,
        hasMore: false
      });
    });

    it('should handle empty results', () => {
      const result = createPaginationResponse(0, 10, 0);
      
      expect(result).toEqual({
        total: 0,
        limit: 10,
        offset: 0,
        hasMore: false
      });
    });
  });
});