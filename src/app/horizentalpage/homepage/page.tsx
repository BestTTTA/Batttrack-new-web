"use client"

import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


const HomePage = () => {
  const [name, setName] = useState<string>("")
  const router = useRouter();
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const localName = localStorage.getItem("Name")
    setName(localName || "")
  }, [])

  useEffect(() => {
    if (name) {
      Getworking();
    }
  }, [name])


  const GetdataAndNavigation = async (serial: any) => {
    try {
      const responseData = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/search_project_details/${serial}`);
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

  const Getworking = async () => {
    try {
      const responseWorking = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/search_by_employee_work_not_done/${name}/`)
      if (responseWorking.status === 200) {
        console.log("Success get responseWorking", responseWorking.data)
        setData(responseWorking.data)
      }
    } catch (error) {
      console.log("Error get working", error)
    }
  }

  return (
    <section id="home_page" className="overflow-x-auto p-4 whitespace-nowrap h-screen min-w-full bg-gray-700 transition duration-500 ease-in-out">
      {
        data && data.length > 0 ? (
          <div className='rounded-md w-full h-full drop-shadow-xl space-y-4'>
            {data.map((details, index) => (
              <div key={details.id || index} className='flex flex-col bg-gray-200 h-fit rounded-md drop-shadow-lg p-2'>
                <div className='flex h-full items-center gap-2 border-b border-black'>
                  <p className=' text-base font-bold'>โปรเจค</p>
                  <p className='text-orange-500 font-bold text-md'>{details.name_project_head}</p>
                </div>
                <div className='w-full h-full grid grid-flow-col'>
                  <div className='flex h-full flex-col justify-between'>
                    <p className='text-sm'>สถานะ</p>
                    <p className='text-[13px]'>{details.list_serial?.[0]?.process_status === false ? "กำลังดำเนินการ" : "N/A"}</p>
                  </div>
                  <div className='flex h-full flex-col justify-between'>
                    <p className='text-sm'>งานของคุณ</p>
                    <p className='text-sm'>
                      {details.list_serial?.[0]?.process_step.length ?? "N/A"}
                    </p>
                  </div>
                  <div className='flex h-full flex-col justify-center'>
                    <button onClick={() => { GetdataAndNavigation(details.list_serial?.[0]?.serial_number) }} className='underline focus:text-orange-500 focus:scale-105 text-sm'>ดำเนินการต่อ</button>
                </div>
              </div>
              </div>
        ))}
    </div>
  ) : (
    <div className='w-full h-full flex items-center justify-center bg-gray-500 rounded-md'>
      <p className='text-white'>ไม่พบข้อมูล</p>
    </div>
  )
}

    </section >
  );
};

export default HomePage;
