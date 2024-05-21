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
    process_step: ProcessStep[];
}

export default function useUpdate() {
    const router = useRouter();
    const currentDateTimeThailand = moment().format('DD-MM-YYYY HH:mm:ss');
    const [effected, setEffected] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [serial, setSerial] = useState<string>("No result");
    const [resultScan, setResultScan] = useState<string>("");
    const [name_project, setNameProject] = useState<string>("");
    const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [openBreak, setOpenBreak] = useState<boolean>(false);
    const [breakDescription, setBreakDescription] = useState<string>("");

    useEffect(() => {
        const localNameProject = localStorage.getItem("name_project");
        if (localNameProject) {
            setNameProject(localNameProject);
        }
    }, [effected]);

    useEffect(() => {
        const localName = localStorage.getItem("Name") || "";
        const localPassword = localStorage.getItem("Password") || "";
        const localSerial = localStorage.getItem("serial");
        setSerial(localSerial || "");
        setName(localName);
        setPassword(localPassword);
    }, []);

    const handleScan = (result: any, error: Error | null | undefined) => {
        if (result) {
            setShowModal(true);
            setResultScan(result?.text || "");
            setEffected(prev => prev + 1);
        }
        if (error) {
            // console.info('Scan Error:', error);
        }
    };



    const handleCloseModal = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowModal(false);
    };

    const GetdataAndNavigation = async () => {
        try {
            const responseData = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/search_project_details/${resultScan}`);
            if (responseData.status === 200) {
                console.log("Project Response success", responseData.data);
                console.log(responseData.data)
                const serializedData = encodeURIComponent(JSON.stringify(responseData.data));
                router.push(`/option/details?projectdetails=${serializedData}`);
            }
        } catch (error) {
            console.log("Error Getdata project", error);
        }
    };

    const handleOK = async () => {
        console.log("OK Button Clicked");
        if (projectDetails) {
            const firstStep = projectDetails.process_step.find(step => !step.process_status);
            if (firstStep && firstStep.timestart === "-") {
                await UpdateWorkStarttime();
            } else {
                await UpdateStartStep();
            }
        }
    };

    const Getdata = async () => {
        try {
            const responseData = await axios.get<ProjectDetails>(`${process.env.NEXT_PUBLIC_BASE_URL}/search_project_details/EQModule010523A`);
            if (responseData.status === 200) {
                console.log("get data success", responseData.data)
                setProjectDetails(responseData.data);
            }
        } catch (error) {
            console.error("Error fetching project details", error);
            console.log("serial number:", serial || "")
        }
    };

    useEffect(() => {
        if (serial) {
            Getdata();
        }
    }, [effected, openBreak]);

    // useEffect(() => {
    //     Getdata();
    // }, []);

    const UpdateWorkStarttime = async () => {
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/start_process/${currentDateTimeThailand}`);
            console.log("Update time start success", response.data);
            if (response.status === 200 && projectDetails) {
                // Assume the logic to update the step needs to be triggered here
                UpdateStartStep();
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

    const UpdateStartStep = async () => {
        console.log("Updating start step");
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
            console.log(`Step ${step.name_step} start updated successfully`, response.data);
            GetdataAndNavigation();
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
            console.log(`Step ${step.name_step} End updated successfully`, response.data);
            GetdataAndNavigation();
        } catch (error) {
            console.error(`Error updating End for step ${step.name_step}`, error);
        }
    };

    const UpdateWorkEndtime = async () => {
        try {
            const responseData = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/end_process/${currentDateTimeThailand}`);
            if (responseData.status === 200) {
                console.log("Update time end success", responseData.data);
                GetdataAndNavigation();
            }
        } catch (error) {
            console.error("Error UpdateWorkEndtime", error);
        }
    };

    const UpdateStatus = async () => {
        try {
            const responseData = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/update_status`, {
                process_status: true
            });
            if (responseData.status === 200) {
                console.log("Update status success", responseData.data);
                UpdateWorkEndtime();
            }
        } catch (error) {
            console.log("Error UpdateStatus", error);
        }
    };

    const [allEnd, setAllEnd] = useState(false)
    useEffect(() => {
        if (projectDetails) {
            const checkAllEnd = projectDetails.process_step.every(step => step.process_status)
            if (checkAllEnd) {
                console.log("Effected CheckAll End", checkAllEnd)
                UpdateStatus();
                setAllEnd(true)
            }
        }
    }, [projectDetails])



    const CreateBreak = async (step: ProcessStep) => {
        console.log("is active CreateBreak");
        // /projects/string/string/string/b/create_break
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/${encodeURIComponent(step.name_step)}/${name}/create_break`, {
                describe: breakDescription,
                start_break: currentDateTimeThailand,
                end_break: "-"
            });
            if (response.status === 200) {
                console.log("Break created successfully", response.data);
                setOpenBreak(false);
            }
        } catch (error) {
            console.error(`Error creating break ${step.name_step} and ${serial} and ${name_project}`, error);
        }
    };

    const handleBreak = async () => {
        console.log("is click handleBreak");
        if (projectDetails) {
            const stepToUpdateStatus = projectDetails.process_step.find(step => !step.process_status && step.timestart !== "-");
            if (stepToUpdateStatus) {
                await CreateBreak(stepToUpdateStatus);
            } else {
                alert("โปรดดำเนินการขั้นตอนนี้ก่อน");
            }
        } else {
            console.log("no project deatils handleBreak");
        }
    };


    const EndBreak = async (step: ProcessStep, describe: string) => {
        console.log(encodeURIComponent(describe));
        try {
            const responseData = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${name_project}/${serial}/${encodeURIComponent(step.name_step)}/${encodeURIComponent(describe)}/${name}/${currentDateTimeThailand}/update_endbreak`);
            if (responseData.status === 200) {
                console.log("Update Endbreak success", responseData.data);
                // GetdataAndNavigation();
            }
        } catch (error) {
            console.log("Error EndBreak", error);
        }
    };

    const fetchDataAndEndBreak = async () => {
        setEffected(prev => prev + 1);
        if (projectDetails) {
            // Find the step with an ongoing break
            const stepToUpdateStatus = projectDetails.process_step.find(step =>
                step.employee.some(emp => emp.list_break.some(breakItem => breakItem.start_break !== "-" && breakItem.end_break === "-"))
            );

            // Find the describe value of the current ongoing break
            const getDescribe = projectDetails.process_step.flatMap(step =>
                step.employee.flatMap(emp => emp.list_break)
            ).find(breakItem => breakItem.start_break !== "-" && breakItem.end_break === "-")?.describe;

            // Check if both step and describe are found
            if (stepToUpdateStatus && getDescribe) {
                await EndBreak(stepToUpdateStatus, getDescribe);
            } else {
                alert("โปรดดำเนินการขั้นตอนนี้ก่อน");
            }
        } else {
            console.log("no project details checking break");
        }
    };


    const [isBreaking, setIsBreaking] = useState(false);

    useEffect(() => {
        console.log("Checking break status");

        const fetchDataAndCheckBreak = async () => {
            if (projectDetails) {
                console.log("process is effected");

                // Find the current step where a break is ongoing
                const currentStepWithBreak = projectDetails.process_step.find(step =>
                    step.employee.some(emp => emp.list_break.some(breakItem => breakItem.start_break !== "-" && breakItem.end_break === "-"))
                );

                // Find the next step where the break has been completed
                const getDescribe = projectDetails.process_step.flatMap(step =>
                    step.employee.flatMap(emp => emp.list_break)
                ).find(breakItem => breakItem.start_break !== "-" && breakItem.end_break === "-")

                if (getDescribe) {
                    console.log("Current step with ongoing break found:", getDescribe);
                    setIsBreaking(true);
                } else {
                    setIsBreaking(false);
                }
            } else {
                console.log("no project details checking break");
            }
        };

        fetchDataAndCheckBreak();
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
