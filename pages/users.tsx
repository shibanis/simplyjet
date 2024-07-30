// pages/users.tsx
import React from 'react';
import UsersTab from '../app/components/UsersTab'; // Adjust the import path if necessary
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const Users: React.FC = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-100">
            <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mt-8 ml-8"
                onClick={() => router.push('/')}
            >
                Back
            </button>
            <div className=" flex flex-col items-center justify-center pl-8 pr-8 pb-8 mb-4">
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

        </div>
    );
};

export default Users;
