"use client"

import React, { FC } from 'react';
import { QrReader } from 'react-qr-reader';
import useUpdate from '@/app/hooks/updatework/useUpdate';
import { IoIosQrScanner } from "react-icons/io";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from 'next/navigation';
const UpdateWork: FC = () => {
    const router = useRouter()

    const { Scan } = useUpdate();

    return (
        <section id="scanpage" className="relative overflow-x-auto whitespace-nowrap flex items-center justify-center snap-center h-screen min-w-full bg-gray-700 transition duration-500 ease-in-out">
            <QrReader
                className="w-full px-2 "
                onResult={Scan.handleScan}
                scanDelay={500}
                constraints={{ facingMode: "environment" }}
            />
            <button onClick={() => {router.back()}} className="absolute top-4 left-3 z-50">
                <IoChevronBack color="white" size={40} />
            </button>
            <div className="absolute top-50 left-50 z-50">
                <IoIosQrScanner color="white" size={200} />
            </div>
            {Scan.showModal && (
                <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="flex w-64 gap-2 justify-center flex-col bg-white rounded-md p-4">
                        <p className="text-center font-bold text-xl">{Scan.serial}</p>
                        <button
                            className="bg-orange-500 h-12 text-white flex justify-center items-center rounded-md"
                            onClick={Scan.handleOK}
                        >
                            อัพเดตงาน
                        </button>
                        <button
                            className="bg-gray-200 h-12 text-gray-800 rounded-md"
                            onClick={Scan.handleCloseModal}
                        >
                            ยกเลิก
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default UpdateWork;
