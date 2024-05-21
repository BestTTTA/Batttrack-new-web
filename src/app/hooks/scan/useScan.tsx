"use client"
import axios from 'axios';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
export default function useScan() {
    const router = useRouter()
    const [showModal, setShowModal] = useState<boolean>(false);
    const [serial, setSerial] = useState<string>("No result");
    const [resultScan, setResultScan] = useState<string>("");

    const handleScan = (result: any) => {
        if (result) {
            setSerial(result?.text ?? "No result");
            setShowModal(true);
            setResultScan(result)
            localStorage.setItem("serial", result?.text)
        }

    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOK = async () => {
        console.log("OK Button Clicked");
        NameProject();
    };

    const NameProject = async () => {
        try {
            const responseData = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/search_project_by_serial/${resultScan}`)
            if (responseData.status === 200) {
                console.log("Name Project Response success", responseData.data)
                localStorage.setItem("name_project", responseData.data.project_name)
                Getdata();
            }
        } catch (error) {
            console.log("Error Getname", error)
        }
    }

    const Getdata = async () => {
        try {
            const responseData = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/search_project_details/${resultScan}`)
            if (responseData.status === 200) {
                const serializedData = encodeURIComponent(JSON.stringify(responseData.data))
                router.push(`/option/details?projectdetails=${serializedData}`)
            }
        } catch (error) {
            console.log("Error Getdata project", error)
        }
    }

    return {
        Scan: {
            serial,
            handleScan,
            handleCloseModal,
            handleOK,
            showModal
        }
    }
}
