"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';

interface ListBreak {
    describe: string;
    start_break: string;
    end_break: string;
}

interface Employee {
    name: string;
    list_break: ListBreak[];
}

interface ProcessStep {
    name_step: string;
    timestart: string;
    endtime: string;
    process_status: boolean;
    employee: Employee[];
}

interface ProjectDetails {
    serial_number: string;
    process_step: ProcessStep[];
}

export default function useUpdate() {
    const router = useRouter();
    const currentDateTimeThailand = moment().format('DD-MM-YYYY HH:mm:ss');
    const [effected, setEffected] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [serial, setSerial] = useState<string>("");
    const [resultScan, setResultScan] = useState<string>("");
    const [name_project, setNameProject] = useState<string>("");
    const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [openBreak, setOpenBreak] = useState<boolean>(false);
    const [breakDescription, setBreakDescription] = useState<string>("พัก");
    const [isBreaking, setIsBreaking] = useState<boolean>(false);
    const [allEnd, setAllEnd] = useState<boolean>(false);
    const [hasNavigated, setHasNavigated] = useState<boolean>(false);

    const Getdata = async (serial: string) => {
        try {
            const responseData = await axios.get<ProjectDetails>(`${process.env.NEXT_PUBLIC_BASE_URL}/search_project_details/${serial}`);
            if (responseData.status === 200) {
                setProjectDetails(responseData.data);
                console.log("Getdata success", responseData.data);
            }
        } catch (error) {
            console.log("error this is", serial);
            console.error("Error fetching project details", error);
        }
    };

    useEffect(() => {
        const localNameProject = localStorage.getItem("name_project");
        if (localNameProject) {
            setNameProject(localNameProject);
        }
    }, [effected]);

    useEffect(() => {
        console.log("Component mounted");
        const localName = localStorage.getItem("Name") || "";
        const localPassword = localStorage.getItem("Password") || "";
        const localSerial = localStorage.getItem("serial") || "";
        if (localSerial) {
            setSerial(localSerial);
            Getdata(localSerial);
        }
        setName(localName);
        setPassword(localPassword);
    }, []);

    const handleScan = (result: any) => {
        if (result) {
            setShowModal(true);
            setResultScan(result?.text || "");
            setEffected(prev => prev + 1);
        }
    };

    const handleCloseModal = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowModal(false);
    };

    const getDataAndNavigation = async (serial: string) => {
        if (!hasNavigated) {
            try {
                const responseData = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/search_project_details/${serial}`);
                if (responseData.status === 200) {
                    const serializedData = encodeURIComponent(JSON.stringify(responseData.data));
                    router.push(`/option/details?projectdetails=${serializedData}`);
                    setHasNavigated(true);
                }
            } catch (error) {
                console.log("Error Getdata project", error);
            }
        }
    };

    const handleOK = async () => {
        if (projectDetails) {
            const firstStep = projectDetails.process_step.find(step => !step.process_status);
            if (firstStep && firstStep.timestart === "-") {
                await UpdateWorkStarttime();
            } else {
                await updateStartStep();
            }
        }
    };

    const UpdateWorkStarttime = async () => {
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/start_process/${currentDateTimeThailand}`);
            if (response.status === 200 && projectDetails) {
                await updateStartStep();
            }
        } catch (error) {
            console.error("Error UpdateWorkStarttime", error);
        }
    };

    const UpdateWorkEmp = async (step: ProcessStep) => {
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/app_emp_project_step?name_step=${encodeURIComponent(step.name_step)}`, {
                name: name,
                list_break: []
            });
            if (response.status === 200) {
                console.log("Add emp success");
            }
        } catch (error) {
            console.error("Error UpdateWorkEmp", error);
        }
    };

    const updateStartStep = async () => {
        if (projectDetails) {
            const stepToUpdateStart = projectDetails.process_step.find(step => !step.process_status && step.timestart === "-" && step.endtime === "-");
            if (stepToUpdateStart) {
                const stepIndex = projectDetails.process_step.indexOf(stepToUpdateStart);
                if (stepIndex === 0 || (projectDetails.process_step[stepIndex - 1].process_status)) {
                    await updateProjectStepStart(stepToUpdateStart);
                    await UpdateWorkEmp(stepToUpdateStart);
                }
            }
            const stepToUpdateStatus = projectDetails.process_step.find(step => !step.process_status && step.timestart !== "-");
            if (stepToUpdateStatus) {
                await updateProjectStepStatus(stepToUpdateStatus);
                await updateProjectStepEnd(stepToUpdateStatus);
            }
        }
    };

    const updateProjectStepStart = async (step: ProcessStep) => {
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/${encodeURIComponent(step.name_step)}/${currentDateTimeThailand}/update_project_step_start`);
            if (response.status === 200) {
                getDataAndNavigation(serial);
            }
        } catch (error) {
            console.error(`Error updating start for step ${step.name_step}`, error);
        }
    };

    const updateProjectStepStatus = async (stepName: ProcessStep) => {
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/${encodeURIComponent(stepName.name_step)}/update_project_step_status`, {
                process_status: true,
            });
            if (response.status === 200) {
                console.log(`Step ${stepName.name_step} status updated successfully`, response.data);
            }
        } catch (error) {
            console.error(`Error updating status for step ${stepName.name_step}`, error);
        }
    };

    const updateProjectStepEnd = async (step: ProcessStep) => {
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/${encodeURIComponent(step.name_step)}/${currentDateTimeThailand}/update_project_step_end`);
            if (response.status === 200) {
                getDataAndNavigation(serial);
            }
        } catch (error) {
            console.error(`Error updating End for step ${step.name_step}`, error);
        }
    };

    const updateWorkEndtime = async (serial: string) => {
        try {
            const responseData = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/end_process/${currentDateTimeThailand}`);
            if (responseData.status === 200) {
                // getDataAndNavigation(serial);
            }
        } catch (error) {
            console.error("Error updateWorkEndtime", error);
        }
    };

    const updateStatus = async (serial: string) => {
        try {
            const responseData = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/update_status`, {
                process_status: true
            });
            if (responseData.status === 200) {
                updateWorkEndtime(serial);
            }
        } catch (error) {
            console.log("Error updateStatus", error);
        }
    };

    useEffect(() => {   
        console.log("effected activate");
        if (projectDetails) {
            console.log("has project");
            const checkAllEnd = projectDetails.process_step.every(step => step.process_status);
            if (checkAllEnd) {
                console.log("All steps End");
                updateStatus(projectDetails.serial_number);
                setAllEnd(true);
            }
        }
    }, [projectDetails]);

    const createBreak = async (step: ProcessStep) => {
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/${encodeURIComponent(step.name_step)}/${name}/create_break`, {
                describe: breakDescription,
                start_break: currentDateTimeThailand,
                end_break: "-"
            });
            if (response.status === 200) {
                setOpenBreak(false);
                getDataAndNavigation(serial)
            }
        } catch (error) {
            console.error(`Error creating break ${step.name_step} and ${serial} and ${name_project}`, error);
        }
    };

    const handleBreak = async () => {
        if (projectDetails) {
            const stepToUpdateStatus = projectDetails.process_step.find(step => !step.process_status && step.timestart !== "-");
            if (stepToUpdateStatus) {
                console.log("is break")
                getDataAndNavigation(serial)
                await createBreak(stepToUpdateStatus);
            } else {
                alert("โปรดดำเนินการขั้นตอนนี้ก่อน");
            }
        } else {
            console.log("no project details handleBreak");
        }
    };

    const endBreak = async (step: ProcessStep, describe: string) => {
        try {
            const responseData = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/${encodeURIComponent(step.name_step)}/${encodeURIComponent(describe)}/${name}/${currentDateTimeThailand}/update_endbreak`);
            if (responseData.status === 200) {
                setIsBreaking(false);
            }
        } catch (error) {
            console.log("Error EndBreak", error);
        }
    };

    const fetchDataAndEndBreak = async () => {
        if (projectDetails) {
            const stepToUpdateStatus = projectDetails.process_step.find(step =>
                step.employee.some(emp => emp.list_break.some(breakItem => breakItem.start_break !== "-" && breakItem.end_break === "-"))
            );

            const getDescribe = projectDetails.process_step.flatMap(step =>
                step.employee.flatMap(emp => emp.list_break)
            ).find(breakItem => breakItem.start_break !== "-" && breakItem.end_break === "-")?.describe;

            if (stepToUpdateStatus && getDescribe) {
                await endBreak(stepToUpdateStatus, getDescribe);
            } else {
                alert("โปรดดำเนินการขั้นตอนนี้ก่อน");
            }
        }
    };

    useEffect(() => {
        if (projectDetails) {
            const currentStepWithBreak = projectDetails.process_step.find(step =>
                step.employee.some(emp => emp.list_break.some(breakItem => breakItem.start_break !== "-" && breakItem.end_break === "-"))
            );
            if (currentStepWithBreak) {
                setIsBreaking(true);
            } else {
                setIsBreaking(false);
            }
        }
    }, [projectDetails]);

    return {
        Scan: {
            serial,
            handleScan,
            handleCloseModal,
            handleOK,
            showModal,
            handleBreak,
            setOpenBreak,
            openBreak,
            setBreakDescription,
            isBreaking,
            fetchDataAndEndBreak,
            allEnd
        },
    };
}
