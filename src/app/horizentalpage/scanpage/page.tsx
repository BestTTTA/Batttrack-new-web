"use client";
import React, { FC, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { IoIosQrScanner } from "react-icons/io";
import useScan from '@/app/hooks/scan/useScan';

const Scanpage: FC = () => {
    const { Scan } = useScan();
    const [showModal, setShowModal] = useState(false);

    const handleScanResult = (result: any) => {
        if (result) {
            Scan.handleScan(result);
            setShowModal(true);
        }
    };

    const handleOK = () => {
        Scan.handleOK();
        setShowModal(false);
    };

    const handleCloseModal = () => {
        Scan.handleCloseModal();
        setShowModal(false);
    };

    return (
        <section id="scan_page" className="relative overflow-x-auto whitespace-nowrap flex items-center justify-center snap-center h-screen min-w-full bg-gray-700 transition duration-500 ease-in-out">
            <QrReader
                className="w-full px-2"
                onResult={handleScanResult}
                scanDelay={500}
                constraints={{ facingMode: "environment" }}
            />
            <div className="absolute top-50 left-50 z-50">
                <IoIosQrScanner color="white" size={200} />
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 bg-gray-700">
                    <div className="flex w-64 gap-2 justify-center flex-col bg-white rounded-md p-4">
                        <p className="text-center font-bold text-xl">{Scan.serial}</p>
                        <button
                            className="bg-orange-500 h-12 text-white flex justify-center items-center rounded-md"
                            onClick={handleOK}
                        >
                            อัพเดตงาน
                        </button>
                        <button
                            className="bg-gray-200 h-12 text-gray-800 rounded-md"
                            onClick={handleCloseModal}
                        >
                            ยกเลิก
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Scanpage;
