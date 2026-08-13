import { getSupabase } from '@/data/supabase/client';
import { throwIfError } from '@/data/supabase/errors';
import { mapCustomer, mapOrderListItem, type CustomerRow, type OrderRow } from '@/data/supabase/mappers';
import type { Customer, CustomerDetail } from '@/domain/entities';
import type { ICustomerRepository } from '@/domain/repositories/ICustomerRepository';

const LIST_SELECT = `
  id, customer_id, order_type, delivery_date, delivery_time, remarks, status, total_amount, created_at, updated_at,
  customers (*),
  order_items (id)
`;

export const customerRepository: ICustomerRepository = {
  async searchCustomers(query: string): Promise<Customer[]> {
    const supabase = getSupabase();
    const trimmed = query.trim();
    let request = supabase.from('customers').select('*').order('name', { ascending: true }).limit(40);

    if (trimmed) {
      const safe = trimmed.replace(/[%_,()]/g, '');
      if (safe) {
        request = request.or(`name.ilike.%${safe}%,contact_number.ilike.%${safe}%`);
      }
    }

    const { data, error } = await request;
    throwIfError(error, 'Could not search customers.');
    return ((data ?? []) as CustomerRow[]).map(mapCustomer);
  },

  async getCustomerWithOrders(id: string): Promise<CustomerDetail> {
    const supabase = getSupabase();
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    throwIfError(customerError, 'Could not load customer.');

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(LIST_SELECT)
      .eq('customer_id', id)
      .order('delivery_date', { ascending: false })
      .order('delivery_time', { ascending: false });

    throwIfError(ordersError, 'Could not load customer orders.');

    return {
      customer: mapCustomer(customer as CustomerRow),
      orders: ((orders ?? []) as OrderRow[]).map(mapOrderListItem),
    };
  },

  async findByContact(contactNumber: string): Promise<Customer | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('contact_number', contactNumber.trim())
      .maybeSingle();

    throwIfError(error, 'Could not look up customer.');
    return data ? mapCustomer(data as CustomerRow) : null;
  },
};
