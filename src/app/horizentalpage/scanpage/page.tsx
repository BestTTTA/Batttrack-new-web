import React, { FC } from 'react';
import { QrReader } from 'react-qr-reader';
import useScan from '@/app/hooks/scan/useScan';
import { IoIosQrScanner } from "react-icons/io";

const Scanpage: FC = () => {

    const { Scan } = useScan();

    return (
        <section id="scanpage" className="relative overflow-x-auto whitespace-nowrap flex items-center justify-center snap-center h-screen min-w-full bg-gray-700 transition duration-500 ease-in-out">
            <QrReader
                className="w-full px-2 "
                onResult={Scan.handleScan}
                scanDelay={500}
                constraints={{ facingMode: "environment" }}
            />
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

export default Scanpage;
