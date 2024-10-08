"use client"
import { useEffect, useState } from 'react';
import GetProjects from '../services/getAllProduct';
import { Projects } from '../services/type';
import Link from 'next/link';
import { GrOptimize } from "react-icons/gr";
import Image from 'next/image';
const Admin = () => {
    const [projects, setProjects] = useState<Projects[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await GetProjects();
                setProjects(data);
            } catch (error) {
                setError('Error fetching projects');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return <div className='h-screen w-full flex justify-center items-center bg-gray-800 text-white'>Loading...</div>;
    }

    if (error) {
        return <div>เกิดข้อผิดพลาดขณะโหลดข้อมูล: {error}</div>;
    }

    if (projects) {
        return (
            <main className="h-screen bg-gray-700 p-4">
                <div className="w-full h-full">
                    {projects.map((project, index) => (
                        <div key={index} className='flex'>
                            <Link href={{
                                pathname: '/admin_projects',
                                query: { name_project: project.name_project_head },
                            }} className='bg-white w-full rounded-md p-2 mb-2 hover:scale-102 drop-shadow-md'>
                                <p className='text-orange-500'>{project.name_project_head}</p>
                            </Link>
                        </div>
                    ))}
                </div>
                <div className='absolute bottom-2 right-2'>
                    <Link href="https://battrack-optimization-web.vercel.app" className='flex flex-col items-center hover:scale-105'>
                        <GrOptimize size={50} color='orange' />
                        <p className='text-orange-500'>Optimize</p>
                    </Link>
                </div>
            </main>
        );
    }

    return null;
};

export default Admin;
