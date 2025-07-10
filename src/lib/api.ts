// This file centralizes all API calls for the Felix Platform.
// In a real-world application, these functions would make network requests
// to your backend services. For this scaffold, they return mock data.

// A simple sleep utility to simulate network latency.
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Transaction {
  id: string;
  name: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Guest';
  lastLogin: string;
}

export const getDashboardData = async () => {
  await sleep(500); // Simulate network delay

  return {
    revenue: 45231.89,
    subscriptions: 2350,
    sales: 12234,
    activeNow: 573,
  };
};

export const getTransactions = async (): Promise<Transaction[]> => {
  await sleep(700);

  return [
    { id: 'txn_1', name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: 1999.0, status: 'success', date: '2023-08-15' },
    { id: 'txn_2', name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: 39.0, status: 'processing', date: '2023-08-14' },
    { id: 'txn_3', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: 299.0, status: 'success', date: '2023-08-13' },
    { id: 'txn_4', name: 'William Kim', email: 'will@email.com', amount: 99.0, status: 'failed', date: '2023-08-12' },
    { id: 'txn_5', name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 650.5, status: 'success', date: '2023-08-11' },
  ];
};

export const getUsers = async (): Promise<User[]> => {
    await sleep(600);
    return [
        { id: 'usr_1', name: 'Admin User', email: 'admin@felix.com', role: 'Admin', lastLogin: '2 hours ago' },
        { id: 'usr_2', name: 'John Doe', email: 'john.d@email.com', role: 'User', lastLogin: '1 day ago' },
        { id: 'usr_3', name: 'Jane Smith', email: 'jane.s@email.com', role: 'User', lastLogin: '5 minutes ago' },
    ]
}
