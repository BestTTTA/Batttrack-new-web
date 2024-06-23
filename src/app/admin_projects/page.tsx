import React, { Suspense } from 'react';
import AdminProjectContent from './AdminProjectContent'; // Move the main content to a separate component

const AdminProject: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminProjectContent />
        </Suspense>
    );
};

export default AdminProject;
