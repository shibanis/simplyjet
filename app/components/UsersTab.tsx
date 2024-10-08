import * as React from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  alternate_email: string;
  password: string;
  age: number;
}

const fetchUsers = async (page: number, pageSize: number, search: string, minAge: number, maxAge: number): Promise<{ users: User[], total: number }> => {
  const res = await fetch(`/api/users?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&minAge=${minAge}&maxAge=${maxAge}`);
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  return res.json();
};

const addUser = async (newUser: Omit<User, 'id'>) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(newUser),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to add user');
  }
  return response.json();
};

const updateUser = async (updatedUser: User) => {
  const response = await fetch(`/api/users`, {
    method: 'PUT',
    body: JSON.stringify(updatedUser),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return response.json();
};

const deleteUser = async (ids: string) => {
  const response = await fetch(`/api/users`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return response.json();
};

const deleteSelectedUsers = async (ids: string[]) => {
  const response = await fetch(`/api/users`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete selected users');
  }
  return response.json();
};

const columnHelper = createColumnHelper<User>();

const UsersTab = () => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  const [minAge, setMinAge] = useState<number | undefined>(undefined);
  const [maxAge, setMaxAge] = useState<number | undefined>(undefined);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const { data, error, isLoading } = useQuery({
    queryKey: ['users', pagination, search, minAge, maxAge],
    queryFn: () => fetchUsers(pagination.pageIndex, pagination.pageSize, search, minAge || 0, maxAge || 100)
  });

  const users = data?.users || [];
  const total = data?.total || 0;

  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteSelectedUsersMutation = useMutation({
    mutationFn: deleteSelectedUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSelectedUsers(new Set());
    },
  });

  const columns = [
    columnHelper.accessor('first_name', {
      cell: info => info.getValue(),
      footer: info => info.column.id,
      header: () => 'First Name',
    }),
    columnHelper.accessor('last_name', {
      cell: info => <i>{info.getValue()}</i>,
      footer: info => info.column.id,
      header: () => 'Last Name',
    }),
    columnHelper.accessor('email', {
      header: () => 'Email',
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('alternate_email', {
      header: () => 'Alternate Email',
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              setEditUser(row.original);
              setIsEditing(true);
            }}
            className="bg-blue-dark text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => {
              deleteUserMutation.mutate(row.original.id);
            }}
            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
          <input
            type="checkbox"
            checked={selectedUsers.has(row.original.id)}
            onChange={() => {
              const newSelectedUsers = new Set(selectedUsers);
              if (selectedUsers.has(row.original.id)) {
                newSelectedUsers.delete(row.original.id);
              } else {
                newSelectedUsers.add(row.original.id);
              }
              setSelectedUsers(newSelectedUsers);
            }}
          />
        </div>
      ),
      footer: info => info.column.id,
    }),
  ];

  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    first_name: '',
    last_name: '',
    email: '',
    alternate_email: '',
    password: '',
    age: 0,
  });

  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    if (newUser.age <= 18) {
      setErrorMessage('Age must be greater than 18');
      return;
    }
    if (isEditing && editUser) {
      updateUserMutation.mutate({ ...editUser, ...newUser });
      setEditUser(null);
      setIsEditing(false);
    } else {
      addUserMutation.mutate(newUser);
    }
    setNewUser({
      first_name: '',
      last_name: '',
      email: '',
      alternate_email: '',
      password: '',
      age: 0,
    });
  };

  const table = useReactTable({
    data: users,
    columns,
    pageCount: Math.ceil(total / pagination.pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (isLoading) return 'Loading...';
  if (error) return 'An error occurred';

  return (
    <div className="p-4 bg-blue-light">

      <form onSubmit={handleFormSubmit} className="mb-4">
        <h2 className="text-2xl mb-2">{isEditing ? 'Edit User' : 'Add User'}</h2>
        {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
        <input
          type="text"
          placeholder="First Name"
          value={newUser.first_name}
          onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newUser.last_name}
          onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="email"
          placeholder="Alternate Email"
          value={newUser.alternate_email}
          onChange={(e) => setNewUser({ ...newUser, alternate_email: e.target.value })}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={newUser.age === 0 ? '' : newUser.age}
          onChange={(e) => setNewUser({ ...newUser, age: Number(e.target.value) })}
          className="border p-2 mb-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-dark text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isEditing ? 'Update User' : 'Add User'}
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <div className="flex space-between">
          <input
            type="number"
            placeholder="Min Age"
            value={minAge === undefined ? '' : minAge}
            onChange={(e) => setMinAge(e.target.value ? Number(e.target.value) : undefined)}
            className="border p-2 mb-2 w-full mr-4"
          />
          <input
            type="number"
            placeholder="Max Age"
            value={maxAge === undefined ? '' : maxAge}
            onChange={(e) => setMaxAge(e.target.value ? Number(e.target.value) : undefined)}
            className="border p-2 mb-2 w-full"
          />
        </div>

      </div>

      <button
        onClick={() => {
          deleteSelectedUsersMutation.mutate(Array.from(selectedUsers));
        }}
        className="bg-red-600 text-white px-4 py-2 rounded mb-4 hover:bg-red-700"
        disabled={selectedUsers.size === 0}
      >
        Delete Selected Users
      </button>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {table.getHeaderGroups().map(headerGroup => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-2 border">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2 border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersTab;
