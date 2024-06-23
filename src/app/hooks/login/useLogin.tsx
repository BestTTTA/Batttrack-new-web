import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useValueContext } from '@/app/context';

export default function useLogin() {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { setProfile } = useValueContext()

    useEffect(() => {
        const localName = localStorage.getItem("Name") || "";
        const localPassword = localStorage.getItem("Password") || "";
        setName(localName);
        setPassword(localPassword)
    }, []);

    const nameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setName(event.target.value);
    };

    const passwordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(event.target.value);
    };


    const login = async (): Promise<void> => {
        localStorage.clear()
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/login/`, `grant_type=&username=${name}&password=${password}&scope=&client_id=&client_secret=`);
            if (response.status === 200) {
                localStorage.setItem("Name", response.data.username);
                localStorage.setItem("Password", password);
                setProfile(response.data.picture_url)
                if (response.data.username === "admin") {
                    router.push('/admin')
                } else {
                    router.push("/option");
                }
            } else {
                alert("Login failed, please check your credentials.");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/login/`)
            alert("ชื่อ หรือ รหัสผ่านไม่ถูกต้อง");
        } finally {
            setLoading(false);
        }
    };

    return {
        name,
        loading,
        nameChange,
        passwordChange,
        login
    };
}
