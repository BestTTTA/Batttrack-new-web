"use client"

import UseLogin from '@/app/hooks/login/useLogin';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
    const {
        name,
        password,
        loading,
        nameChange,
        passwordChange,
        login
    }: any = UseLogin();



    return (
        <main className=" bg-gray-900 h-screen flex items-center px-12">
            {loading ? (
                <div className='absolute left-0 flex justify-center items-center w-full h-screen bg-gray-900 opacity-50'>
                    <span className="animate-ping absolute inline-flex justify-center items-center h-12 w-12 rounded-full bg-orange-400 opacity-80">
                        <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-orange-400 opacity-90"></span>
                    </span>
                </div>
            ) : null}

            <div className="flex flex-col items-center justify-center w-full">
                <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                    <div className='p-2 h-full w-full flex items-center justify-center'>
                        <Image src="/image.png" width={100} height={70} alt="logo" />
                    </div>
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">ชื่อ</label>
                            <input onChange={nameChange} value={name} type="text" className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="กรอกชื่อ" required />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">รหัสผ่าน</label>
                            <input onChange={passwordChange} value={password} type="text" placeholder="••••••••" className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" required />
                        </div>
                        <button onClick={login} className='w-full bg-orange-500 p-2 rounded-md text-white'>เข้าสู่ระบบ</button>
                        <Link href="/users/register">
                            <span className="flex justify-center w-full underline text-sm font-light text-gray-500">
                                สมัครสมาชิก
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
