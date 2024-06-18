'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { IoHomeSharp } from "react-icons/io5";
import useUpdate from '@/app/hooks/updatework/useUpdate';
import DownloadExcel from '../components/DowloadData';

interface ListBreak {
  describe: string;
  start_break: string;
  end_break: string;
}

interface Employee {
  list_break: ListBreak[];
  name: string;
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
  timestart: string;
  endtime: string;
  process_status: boolean;
  process_step: ProcessStep[];
}

const Details: React.FC = () => {
  const searchParams = useSearchParams();
  const projectDetails = searchParams.get('projectdetails');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { Scan } = useUpdate();
  let details: ProjectDetails | null = null;

  if (projectDetails) {
    try {
      details = JSON.parse(projectDetails);
    } catch (error) {
      console.error('Failed to parse project details:', error);
    }
  }

  return (
    <>
      <div className='bg-gray-700 h-screen p-4 relative flex flex-col items-center'>
        <div className='rounded-md w-full bg-gray-500 p-2 text-white'>
          {details ? (
            <div className="list-disc">
              <div className='font-bold'>Serial Number: <strong className='text-orange-400'>{details.serial_number}</strong></div>
              <div>Start Time: <strong>{details.timestart}</strong></div>
              <div>End Time: <strong>{details.endtime}</strong></div>
              <div className="flex">
                Process Status:
                {details.process_status ? (
                  <p className='text-orange-500 mx-2'>ดำเนินการเสร็จสิ้น</p>
                ) : details.timestart != "-" ? (
                  <p className='text-yellow-400 mx-2'>กำลังดำเนินการ</p>
                ) : (
                  <p className='text-red-800 mx-2'>รอดำเนินการ</p>
                )}
              </div>
              <div>
                <div onClick={() => setDropdownOpen(!dropdownOpen)} className="text-white rounded-lg w-full flex justify-between ">
                  <button className="text-white rounded-lg w-full flex justify-between">
                    Process Steps
                  </button>
                  <button>▼</button>
                </div>
                {dropdownOpen && (
                  <div className="w-full shadow-lg rounded-lg flex">
                    {details.process_step.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto flex flex-col justify-start">
                        {details.process_step.map((step, index) => (
                          <div key={index} className="px-2 py-2">
                            <p className='text-gray-900 font-bold text-[24px]'>{step.name_step}</p>
                            <p>Start Time: {step.timestart}</p>
                            <p>End Time: {step.endtime}</p>
                            <div className="flex">
                              Status:
                              {step.process_status ? (
                                <p className='text-orange-500 mx-2'>ดำเนินการเสร็จสิ้น</p>
                              ) : step.timestart != "-" ? (
                                <p className='text-yellow-400 mx-2'>กำลังดำเนินการ</p>
                              ) : (
                                <p className='text-red-800 mx-2'>รอดำเนินการ</p>
                              )}
                            </div>
                            <p>Employees: {step.employee.length > 0 ? step.employee.map(emp => emp.name).join("") : 'ยังไม่มีพนักงาน'}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="px-4 py-2">None</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p>No project details available</p>
          )}

        </div>
        {Scan.isBreaking ? (
          <div onClick={Scan.fetchDataAndEndBreak} className='w-full text-center bg-orange-500 p-2 mt-2 rounded-md focus:scale-105 text-white'>
            ดำเนินการต่อ
          </div>
        ) : !Scan.allEnd ? (
          <>
            {Scan.start ?
              < Link href="/updatework" className='w-full text-center bg-orange-500 p-2 mt-4 rounded-md focus:scale-105 text-white'>
                เริ่มงาน
              </Link> :
              < Link href="/updatework" className='w-full text-center bg-orange-500 p-2 mt-4 rounded-md focus:scale-105 text-white'>
                จบงาน
              </Link>
            }
            <div onClick={() => { Scan.setOpenBreak(true) }} className='w-full text-center bg-red-500 p-2 mt-2 rounded-md focus:scale-105 text-white'>
              พัก
            </div>
          </>
        ) : null}
        {details && <DownloadExcel json_data={details} />}
        {Scan.openBreak && (
          <div className='bg-gray-600 rounded-md drop-shadow-lg absolute flex flex-col w-80 h-fit top-60 p-4'>
            <button onClick={() => { Scan.setOpenBreak(false) }} className='absolute top-2 right-2 bg-white rounded-full text-black font-bold w-6 h-6 focus:scale-105'>X</button>
            <input
              type='text'
              placeholder='ใส่คำอธิบาย'
              className='mt-10 p-2 rounded-md'
              onChange={(e) => Scan.setBreakDescription(e.target.value)}
            />
            <button
              onClick={Scan.handleBreak}
              className='mt-4 bg-red-500 text-white p-2 rounded-md'
            >
              พัก
            </button>
          </div>
        )}
        <Link href="/option" className='absolute bottom-2 rounded-full p-2 flex items-center justify-center drop-shadow-lg focus:scale-105'>
          <IoHomeSharp size={40} color='white' />
        </Link>
      </div >
    </>
  );
};

const WrappedDetails: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Details />
    </Suspense>
  );
};

export default WrappedDetails;
