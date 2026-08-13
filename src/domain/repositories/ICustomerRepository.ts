import type { Customer, CustomerDetail } from '@/domain/entities';

export interface ICustomerRepository {
  searchCustomers(query: string): Promise<Customer[]>;
  getCustomerWithOrders(id: string): Promise<CustomerDetail>;
  findByContact(contactNumber: string): Promise<Customer | null>;
}
