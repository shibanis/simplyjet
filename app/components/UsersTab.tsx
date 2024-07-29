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

// User Type
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  alternate_email: string;
  password: string;
  age: number;
}

// API Functions
const fetchUsers = async (page: number, pageSize: number): Promise<{ users: User[], total: number }> => {
  const res = await fetch(`/api/users?page=${page}&pageSize=${pageSize}`);
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

const deleteUser = async (id: string) => {
  const response = await fetch(`/api/users`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return response.json();
};

// Column Helper
const columnHelper = createColumnHelper<User>();

// Main Component
const UsersTab = () => {
  const queryClient = useQueryClient();
  
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const { data, error, isLoading } = useQuery({
    queryKey: ['users', pagination],
    queryFn: () => fetchUsers(pagination.pageIndex, pagination.pageSize),
    keepPreviousData: true,
  });
  
  const users = data?.users || [];
  const total = data?.total || 0;

  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries(['users']),
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
        <div className="flex gap-2">
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
    age: 18,
  });

  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addUserMutation.mutate(newUser);
    setNewUser({
      first_name: '',
      last_name: '',
      email: '',
      alternate_email: '',
      password: '',
      age: 18,
    });
  };

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editUser) {
      updateUserMutation.mutate({ ...editUser, ...newUser });
      setEditUser(null);
      setIsEditing(false);
      setNewUser({
        first_name: '',
        last_name: '',
        email: '',
        alternate_email: '',
        password: '',
        age: 18,
      });
    }
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
    <div className="p-4">
      <form
        onSubmit={isEditing ? handleUpdateUser : handleAddUser}
        className="mb-4"
      >
        <h2 className="text-2xl mb-2">{isEditing ? 'Edit User' : 'Add User'}</h2>
        <input
          type="text"
          placeholder="First Name"
          value={newUser.first_name}
          onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
          className="block mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newUser.last_name}
          onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
          className="block mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="block mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          placeholder="Alternate Email"
          value={newUser.alternate_email}
          onChange={(e) => setNewUser({ ...newUser, alternate_email: e.target.value })}
          className="block mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="block mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="Age"
          value={newUser.age}
          onChange={(e) => setNewUser({ ...newUser, age: Number(e.target.value) })}
          className="block mb-2 p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-blue-dark text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isEditing ? 'Update User' : 'Add User'}
        </button>
      </form>

      <table className="min-w-full border-collapse border border-gray-300 bg-white">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border border-gray-300 p-2 bg-blue-100 text-left">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border border-gray-300 p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="border p-2"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span className="mx-2">
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <button
          className="border p-2"
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
