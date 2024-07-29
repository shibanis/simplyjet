"use client";

import { useState } from 'react';
import UsersTab from '../components/UsersTab';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Users');

  return (
    <div className="flex">
      <nav className="w-1/4">
        <ul>
          <li onClick={() => setActiveTab('Users')}>Users</li>
        </ul>
      </nav>
      <main className="w-3/4">
        {activeTab === 'Users' && <UsersTab />}
      </main>
    </div>
  );
};

export default Dashboard;
