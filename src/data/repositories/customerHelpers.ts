import { getSupabase } from '@/data/supabase/client';
import { throwIfError } from '@/data/supabase/errors';
import { mapCustomer, type CustomerRow } from '@/data/supabase/mappers';
import type { Customer } from '@/domain/entities';

export async function upsertCustomer(input: {
  name: string;
  contactNumber: string;
  address?: string;
}): Promise<Customer> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('customers')
    .upsert(
      {
        name: input.name.trim(),
        contact_number: input.contactNumber.trim(),
        address: input.address?.trim() || null,
      },
      { onConflict: 'contact_number' },
    )
    .select()
    .single();

  throwIfError(error, 'Could not save customer.');
  return mapCustomer(data as CustomerRow);
}

export async function findCustomerByContact(contactNumber: string): Promise<Customer | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('contact_number', contactNumber.trim())
    .maybeSingle();

  throwIfError(error, 'Could not look up customer.');
  return data ? mapCustomer(data as CustomerRow) : null;
}
