import { useState, useEffect, useCallback } from 'react';
import { marketplaceService, Service, ServicesResponse } from '@/lib/marketplace-service';

/**
 * Custom hook for managing marketplace services
 * @param initialItemsPerPage Initial number of items per page
 */
export function useMarketplace(initialItemsPerPage: number = 10) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    itemsPerPage: initialItemsPerPage,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  /**
   * Loads services with pagination
   */
  const loadServices = useCallback(async (limit: number = pagination.itemsPerPage, offset: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceService.getServices(limit, offset);
      setServices(response.services);
      updatePagination();
      return response;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'Unknown error occurred');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [pagination.itemsPerPage]);

  /**
   * Updates pagination information
   */
  const updatePagination = useCallback(() => {
    const paginationInfo = marketplaceService.getPaginationInfo();
    setPagination(paginationInfo);
  }, []);

  /**
   * Loads the next page of services
   */
  const loadNextPage = useCallback(async () => {
    if (!pagination.hasNextPage) return null;
    
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceService.loadNextPage();
      setServices(response.services);
      updatePagination();
      return response;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'Unknown error occurred');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [pagination.hasNextPage, updatePagination]);

  /**
   * Loads the previous page of services
   */
  const loadPreviousPage = useCallback(async () => {
    if (!pagination.hasPreviousPage) return null;
    
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceService.loadPreviousPage();
      setServices(response.services);
      updatePagination();
      return response;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'Unknown error occurred');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [pagination.hasPreviousPage, updatePagination]);

  /**
   * Changes the number of items per page
   */
  const setItemsPerPage = useCallback(async (itemsPerPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceService.setItemsPerPage(itemsPerPage);
      setServices(response.services);
      updatePagination();
      return response;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'Unknown error occurred');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [updatePagination]);

  /**
   * Purchases a service
   */
  const purchaseService = useCallback(async (serviceId: string, paymentData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceService.purchaseService(serviceId, paymentData);
      return response;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'Unknown error occurred');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load services on initial render
  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return {
    services,
    loading,
    error,
    pagination,
    loadServices,
    loadNextPage,
    loadPreviousPage,
    setItemsPerPage,
    purchaseService
  };
}
