import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/layout/States';
import { SearchBar } from '@/components/ui/SearchFilter';
import { useCustomerSearch } from '@/hooks/useCustomers';
import { useState } from 'react';

export default function CustomersScreen() {
  const [query, setQuery] = useState('');
  const customers = useCustomerSearch(query);

  return (
    <Screen topInset={false}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search name or number" />
      {customers.isLoading ? <LoadingState /> : null}
      {customers.isError ? (
        <ErrorState message="Could not load customers." onRetry={() => customers.refetch()} />
      ) : null}
      {(customers.data ?? []).map((customer) => (
        <Pressable
          key={customer.id}
          onPress={() => router.push(`/(tabs)/more/customers/${customer.id}`)}
          className="mb-3 rounded-2xl border border-sand bg-paper p-4">
          <Text className="text-lg font-bold text-brown">{customer.name}</Text>
          <Text className="text-sm text-brown-muted">{customer.contactNumber}</Text>
          {customer.address ? <Text className="mt-1 text-sm text-brown-muted">{customer.address}</Text> : null}
        </Pressable>
      ))}
      {!customers.isLoading && (customers.data?.length ?? 0) === 0 ? (
        <EmptyState title="No customers yet" message="Customers are saved automatically when you create an order." />
      ) : null}
    </Screen>
  );
}
