'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react';
import { IoHomeSharp } from "react-icons/io5";
import useUpdate from '@/app/hooks/updatework/useUpdate';
import DownloadExcel from '../components/DowloadData';

interface Employee {
  list_break: any[];
  name: string;
}

export default function Details() {
  const searchParams = useSearchParams()
  const projectDetails = searchParams.get('projectdetails')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { Scan } = useUpdate();
  let details = null

  if (projectDetails) {
    try {
      details = JSON.parse(projectDetails)
    } catch (error) {
      console.error('Failed to parse project details:', error)
    }
  }

  return (
    <>
      <div className='bg-gray-700 min-h-screen p-4 relative flex flex-col items-center'>
        <div className='rounded-md w-full bg-gray-500 p-2 text-white'>
          {details ? (
            <div className="list-disc">
              <div className='font-bold '>Serial Number: <strong className='text-orange-400'>{details.serial_number}</strong></div>
              <div>Start Time: <strong>{details.timestart}</strong></div>
              <div>End Time: <strong>{details.endtime}</strong></div>
              <div className='flex'>Process Status: <strong className='mx-2'>{details.process_status ? <p className='text-orange-400'>ดำเนินการเสร็จสิ้น</p> : <p className='text-red-700'>กำลังดำเนินการ</p>}</strong></div>
              <div>
                <div
                  className="text-white rounded-lg w-full flex justify-between"
                >
                  <button
                    className="text-white rounded-lg w-full flex justify-between"
                    onClick={() => setDropdownOpen(!dropdownOpen)}>
                    Process Steps
                  </button>
                  <button>
                    ▼
                  </button>
                </div>
                {dropdownOpen && (
                  <div className="w-full shadow-lg rounded-lg flex">
                    {details.process_step.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto flex flex-col justify-start">
                        {details.process_step.map((step: any, index: number) => (
                          <div key={index} className="px-2 py-2">
                            {/* <strong>ขั้นตอนที่ {index + 1}:</strong> */}
                            <p className='text-gray-900 font-bold text-lg'>{step.name_step}</p>
                            <p>Start Time: {step.timestart}</p>
                            <p>End Time: {step.endtime}</p>
                            <div className="flex">Status: {step.process_status ? <p className='text-orange-500 mx-2'>ดำเนินการเสร็จสิ้น</p> : <p className='text-red-800 mx-2'>รอดำเนินการ</p>}</div>
                            <p>Employees: {step.employee.length > 0 ? step.employee.map((emp: Employee) => emp.name).join(', ') : 'ยังไม่มีพนักงาน'}</p>
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
        {Scan.isBreaking === true ? (
          <div onClick={Scan.fetchDataAndEndBreak} className='w-full text-center bg-orange-500 p-2 mt-2 rounded-md focus:scale-105 text-white'>
            ดำเนินการต่อ
          </div>
        ) : Scan.allEnd ? null : (
          <>
            <Link href="/updatework" className='w-full text-center bg-orange-500 p-2 mt-4 rounded-md focus:scale-105 text-white'>
              อัพเดตงาน
            </Link>
            <div onClick={() => { Scan.setOpenBreak(true) }} className='w-full text-center bg-red-500 p-2 mt-2 rounded-md focus:scale-105 text-white'>
              พัก
            </div>
          </>
        )}
        <DownloadExcel json_data={details}/>
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
      </div>
    </>
  )
}
