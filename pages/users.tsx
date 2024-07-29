// pages/users.tsx
import React from 'react';
import UsersTab from '../app/components/UsersTab'; // Adjust the import path if necessary
import { motion } from 'framer-motion';

const Users: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold mb-4"
            >
                Users Page
            </motion.h1>
            <UsersTab />
        </div>
    );
};

export default Users;
