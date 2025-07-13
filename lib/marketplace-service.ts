// Marketplace Service - Handles marketplace data and operations
import { felixApi } from './api-service';

export interface Service {
  id: string;
  sender_id: string;
  receiver_id: string;
  amount: number;
  currency: string;
  price: number;
  memo: string;
  xdr: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  stellar_transaction_hash: string | null;
  description: string;
  rating: number;
}

export interface ServicesResponse {
  services: Service[];
  total: number;
  limit: number;
  offset: number;
}

class MarketplaceService {
  private static instance: MarketplaceService;
  private services: Service[] = [];
  private totalServices: number = 0;
  private currentPage: number = 0;
  private itemsPerPage: number = 10;

  private constructor() {}

  public static getInstance(): MarketplaceService {
    if (!MarketplaceService.instance) {
      MarketplaceService.instance = new MarketplaceService();
    }
    return MarketplaceService.instance;
  }

  /**
   * Fetches services with pagination
   * @param limit Number of items per page
   * @param offset Starting index
   * @returns Promise with services data
   */
  public async getServices(limit: number = 10, offset: number = 0): Promise<ServicesResponse> {
    try {
      const response = await felixApi.getAllServices(limit, offset);
      this.services = response.services || [];
      this.totalServices = response.total || 0;
      this.itemsPerPage = limit;
      this.currentPage = Math.floor(offset / limit);
      
      return response;
    } catch (error) {
      console.error('Error fetching marketplace services:', error);
      throw error;
    }
  }

  /**
   * Loads the next page of services
   * @returns Promise with services data
   */
  public async loadNextPage(): Promise<ServicesResponse> {
    const nextPage = this.currentPage + 1;
    const offset = nextPage * this.itemsPerPage;
    
    if (offset < this.totalServices) {
      return this.getServices(this.itemsPerPage, offset);
    }
    
    return {
      services: this.services,
      total: this.totalServices,
      limit: this.itemsPerPage,
      offset: this.currentPage * this.itemsPerPage
    };
  }

  /**
   * Loads the previous page of services
   * @returns Promise with services data
   */
  public async loadPreviousPage(): Promise<ServicesResponse> {
    const prevPage = Math.max(0, this.currentPage - 1);
    const offset = prevPage * this.itemsPerPage;
    
    return this.getServices(this.itemsPerPage, offset);
  }

  /**
   * Purchases a service
   * @param serviceId Service ID to purchase
   * @param paymentData Payment details
   * @returns Promise with purchase response
   */
  public async purchaseService(serviceId: string, paymentData: any): Promise<any> {
    try {
      return await felixApi.purchaseService(serviceId, paymentData);
    } catch (error) {
      console.error('Error purchasing service:', error);
      throw error;
    }
  }

  /**
   * Gets the current pagination state
   * @returns Pagination information
   */
  public getPaginationInfo() {
    return {
      currentPage: this.currentPage,
      totalPages: Math.ceil(this.totalServices / this.itemsPerPage),
      itemsPerPage: this.itemsPerPage,
      totalItems: this.totalServices,
      hasNextPage: (this.currentPage + 1) * this.itemsPerPage < this.totalServices,
      hasPreviousPage: this.currentPage > 0
    };
  }

  /**
   * Sets the items per page and reloads services
   * @param itemsPerPage Number of items to show per page
   * @returns Promise with services data
   */
  public async setItemsPerPage(itemsPerPage: number): Promise<ServicesResponse> {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 0;
    return this.getServices(itemsPerPage, 0);
  }
}

export const marketplaceService = MarketplaceService.getInstance();
