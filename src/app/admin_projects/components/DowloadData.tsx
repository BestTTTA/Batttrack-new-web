import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileDownload } from "react-icons/fa";

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

interface ListSerial {
    serial_number: string;
    timestart: string;
    endtime: string;
    process_status: boolean;
    process_step: ProcessStep[];
}

interface Project {
    name_project_head: string;
    list_serial: ListSerial[];
}

interface DownloadExcelProps {
    json_data: Project[];
}

const DowloadData: React.FC<DownloadExcelProps> = ({ json_data }) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const flattenedData = json_data.flatMap(project => 
                project.list_serial.flatMap(serial => 
                    serial.process_step.map(step => {
                        const employeeNames = step.employee.map(emp => emp.name).join(", ");
                        const listBreaks = step.employee.flatMap(emp => emp.list_break);

                        const calculateBreakDuration = (start: string, end: string) => {
                            if (start === "-" || end === "-") {
                                return "N/A";
                            }
                            const parseDate = (dateString: string) => {
                                const [date, time] = dateString.split(' ');
                                const [day, month, year] = date.split('-').map(Number);
                                const [hours, minutes, seconds] = time.split(':').map(Number);
                                return new Date(year, month - 1, day, hours, minutes, seconds);
                            };

                            const startDate = parseDate(start);
                            const endDate = parseDate(end);

                            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                                return "N/A";
                            }

                            const durationMs = endDate.getTime() - startDate.getTime();
                            const durationMinutes = Math.floor(durationMs / 60000);
                            const durationSeconds = Math.floor((durationMs % 60000) / 1000);
                            return `${durationMinutes} นาที ${durationSeconds} วินาที`;
                        };

                        return {
                            โครงการ: project.name_project_head,
                            เลขSerial: serial.serial_number,
                            เวลาเริ่มโปรเจค: serial.timestart,
                            เวลาจบโปรเจค: serial.endtime,
                            สถานะโปรเจค: serial.process_status ? 'ดำเนินการเสร็จสิ้น' : 'กำลังดำเนินการ',
                            ชื่อขั้นตอน: step.name_step,
                            เริ่มขั้นตอนเมื่อ: step.timestart,
                            จบขั้นตอนเมื่อ: step.endtime,
                            สถานะขั้นตอน: step.process_status ? 'ดำเนินการเสร็จสิ้น' : 'กำลังดำเนินการ',
                            พนักงาน: employeeNames,
                            อธิบายการพัก: listBreaks.map(breakItem => breakItem.describe).join(", ") || "N/A",
                            เวลาเริ่มพัก: listBreaks.map(breakItem => breakItem.start_break).join(", ") || "N/A",
                            จบการพัก: listBreaks.map(breakItem => breakItem.end_break).join(", ") || "N/A",
                            ระยะเวลาการพัก: listBreaks.map(breakItem => calculateBreakDuration(breakItem.start_break, breakItem.end_break)).join(", ") || "N/A",
                        };
                    })
                )
            );

            if (flattenedData.length === 0) {
                throw new Error('No valid data returned from the API.');
            }

            // Convert JSON to worksheet
            const worksheet = XLSX.utils.json_to_sheet(flattenedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Process Steps");

            // Create a temporary file and trigger download
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(dataBlob, 'process_steps.xlsx');
        } catch (error) {
            console.error('Error downloading the data:', error);
            alert('Failed to download the data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleDownload} disabled={loading || !json_data} className='flex fixed bottom-2 right-2 z-50 justify-center w-fit text-center bg-green-100 p-2 mt-4 rounded-full focus:scale-105 text-white drop-shadow-lg'>
            {loading ? 'Downloading...' : <FaFileDownload size={30} color='green' />}
        </button>
    );
};

export default DowloadData;
