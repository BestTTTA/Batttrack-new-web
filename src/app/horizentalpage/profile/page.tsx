"use client"
import { FC, useEffect, useState } from 'react';
import { useValueContext } from '@/app/context';


const Profilepage = () => {

  const [profilethispage, setProfile] = useState<string>("")
  const [name, setName] = useState<string>("")
  const { profile } = useValueContext()

  if (profile) {
    localStorage.setItem("profile", profile)  
  }
  useEffect(() => {
    const localProfile = localStorage.getItem("profile") || ""
    const localName = localStorage.getItem("Name") || ""
    setName(localName)
    setProfile(localProfile)
  }, [])

  return (
    <section id="profile_page" className="overflow-x-auto p-4 whitespace-nowrap h-screen min-w-full bg-gray-700 transition duration-500 ease-in-out" >
      <div className='flex justify-center flex-col items-center h-fit bg-gray-500 rounded-md p-3'>
        <div className='border w-40 h-40 rounded-full drop-shadow-lg overflow-hidden'>
          <img src={profilethispage} alt="" className='w-full h-full' />
        </div>
        <p className='font-bold my-4 text-lg text-white'>รายละเอียด</p>
        <div className='flex w-full'>
        <p className='text-white'><strong>ชื่อ:</strong> {name}</p>
        </div>
      </div>
    </section>
  );
};

export default Profilepage;
