import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'users.json');

/**
 * This file defines the API routes for managing user data. It includes endpoints to handle GET, POST, PUT, and DELETE requests. The user data is stored in a JSON file on the server.
 */
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  alternate_email: string;
  password: string;
  age: number;
}

const readData = (): User[] => {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([])); // Create the file if it doesn't exist
  }
  const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(jsonData);
};

const writeData = (data: User[]) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 0;
  const pageSize = Number(url.searchParams.get('pageSize')) || 10;
  const searchQuery = url.searchParams.get('search')?.toLowerCase() || '';
  const minAge = Number(url.searchParams.get('minAge')) || 0;
  const maxAge = Number(url.searchParams.get('maxAge')) || Infinity;
  
  let users = readData();
  
  // Filtering by age
  users = users.filter(user => user.age >= minAge && user.age <= maxAge);
  
  // Searching by name or email
  if (searchQuery) {
    users = users.filter(user =>
      user.first_name.toLowerCase().includes(searchQuery) ||
      user.last_name.toLowerCase().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery)
    );
  }
  
  const paginatedUsers = users.slice(page * pageSize, (page + 1) * pageSize);
  return NextResponse.json({ users: paginatedUsers, total: users.length });
}

export async function POST(request: Request) {
  const newUser: User = { id: uuidv4(), ...(await request.json()) };
  
  // Validate required fields
  if (!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.age) {
    return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
  }

  const usersData = readData();
  usersData.push(newUser);
  writeData(usersData);
  return NextResponse.json(newUser, { status: 201 });
}

export async function PUT(request: Request) {
  const updatedUser: User = await request.json();
  
  // Validate required fields
  if (!updatedUser.id || !updatedUser.first_name || !updatedUser.last_name || !updatedUser.email || !updatedUser.age) {
    return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
  }

  const usersData = readData();
  const userIndex = usersData.findIndex(user => user.id === updatedUser.id);
  
  if (userIndex === -1) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  usersData[userIndex] = updatedUser;
  writeData(usersData);
  return NextResponse.json(updatedUser);
}

export async function DELETE(request: Request) {
  try {
    const { ids } = await request.json();

    // Normalize ids to always be an array of strings
    let idArray: string[];

    if (typeof ids === 'string') {
      idArray = [ids];
    } else if (Array.isArray(ids) && ids.every(id => typeof id === 'string')) {
      idArray = ids;
    } else {
      return NextResponse.json({ message: 'Invalid input: ids must be an array of strings or a single string' }, { status: 400 });
    }

    const usersData = readData();
    const filteredUsers = usersData.filter(user => !idArray.includes(user.id));

    // Check if any users were deleted
    if (filteredUsers.length === usersData.length) {
      return NextResponse.json({ message: 'No users deleted' }, { status: 404 });
    }

    writeData(filteredUsers);
    return NextResponse.json({ message: 'Users deleted' });
  } catch (error) {
    console.error('Error deleting users:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}


