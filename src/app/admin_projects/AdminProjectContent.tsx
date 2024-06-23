"use client"
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Projects } from '../services/type'; // Import types from the correct path
import getByProductName from '../services/getByProductName'; // Assuming the correct import name
import DowloadData from './components/DowloadData';
const AdminProject = () => {
    const searchParams = useSearchParams();
    const name_project = searchParams.get('name_project');
    const [projectName, setProjectName] = useState<string | null>(null);
    const [projects, setProjects] = useState<Projects[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await getByProductName(projectName || "");
                setProjects(data);
            } catch (error) {
                setError('Error fetching projects');
            } finally {
                setLoading(false);
            }
        };

        if (projectName) {
            fetchProjects();
        }
    }, [projectName]); // Include projectName in dependencies to trigger fetch on change

    useEffect(() => {
        if (name_project) {
            setProjectName(name_project);
        }
    }, [name_project]);

    // Handle initial loading state
    if (loading) {
        return <div className='h-screen w-full flex justify-center items-center bg-gray-800 text-white'>Loading...</div>;
    }

    // Handle error state
    if (error) {
        return <div>Error loading projects: {error}</div>;
    }

    // Check if projects is null before rendering
    if (!projects) {
        return <div>No projects found.</div>;
    }

    // Render projects with dropdown for process steps
    return (
        <main className="min-h-screen bg-gray-700 p-4 relative">
            <DowloadData json_data={projects}/>
            <div className="w-full h-full rounded-md drop-shadow-xl p-4">
                {projects.map((project, index) => (
                    <div key={index} className='bg-white w-full rounded-md p-4 mb-4 drop-shadow-md '>
                        <p className='text-orange-500 mb-2'>{project.name_project_head}</p>
                        {project.list_serial.map((serial, serialIndex) => (
                            <div key={serialIndex} className='bg-gray-200 mb-4 border p-2 rounded-md drop-shadow-lg'>
                                <p className='font-bold'>Serial Number: {serial.serial_number}</p>
                                <p>Start Time: {serial.timestart}</p>
                                <p>End Time: {serial.endtime}</p>
                                <p>Status: {serial.process_status ? "Complete" : "Incomplete"}</p>
                                <details className='mt-2'>
                                    <summary>Process Steps</summary>
                                    {serial.process_step.map((step, stepIndex) => (
                                        <div key={stepIndex} className='ml-4 mt-2'>
                                            <p className='font-semibold'>{step.name_step}</p>
                                            <p>Start Time: {step.timestart}</p>
                                            <p>End Time: {step.endtime}</p>
                                            <p>Status: {step.process_status ? "Complete" : "Incomplete"}</p>
                                            {step.employee.map((emp, empIndex) => (
                                                <div key={empIndex}>
                                                    <div className="flex">
                                                        <p>Employees:</p>
                                                        <p>{emp.name}</p>
                                                    </div>
                                                    <details>
                                                        <summary>Break:</summary>
                                                        {emp.list_break.length > 0 ? (
                                                            emp.list_break.map((list_bk, listBkIndex) => (
                                                                <div key={listBkIndex} className='my-2 bg-gray-500 p-2 rounded-md'>
                                                                    <p>Description: {list_bk.describe}</p>
                                                                    <p>Start Break: {list_bk.start_break}</p>
                                                                    <p>End Break: {list_bk.end_break}</p>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p>ไม่พบข้อมูลการพัก</p>
                                                        )}
                                                    </details>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </details>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </main>
    );
};

export default AdminProject;
