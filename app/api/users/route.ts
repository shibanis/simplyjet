import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'users.json');

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
  
  const users = readData();
  const paginatedUsers = users.slice(page * pageSize, (page + 1) * pageSize);
  return NextResponse.json({ users: paginatedUsers, total: users.length });
}

export async function POST(request: Request) {
  const newUser: User = { id: uuidv4(), ...(await request.json()) };
  const usersData = readData();
  usersData.push(newUser);
  writeData(usersData);
  return NextResponse.json(newUser, { status: 201 });
}

export async function PUT(request: Request) {
  const updatedUser: User = await request.json();
  const updatedUsers = readData().map(user =>
    user.id === updatedUser.id ? updatedUser : user
  );
  writeData(updatedUsers);
  return NextResponse.json(updatedUser);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const filteredUsers = readData().filter(user => user.id !== id);
  writeData(filteredUsers);
  return NextResponse.json({ message: 'User deleted' });
}
