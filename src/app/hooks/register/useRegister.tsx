import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useValueContext } from '@/app/context';


export default function UseRegister() {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { image } = useValueContext()
    const nameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const body = {
        username: name,
        password: password,
        picture_url: image
    }
    const Register = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/register/`, body);
            if (response.status === 201) {
                router.push("/users/login");
                localStorage.setItem("Name", name);
                localStorage.setItem("Password", password);
            }
        } catch (error: any) {
            console.log("Register error:", error)
            console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/register/`)
            console.log(body)
            alert("ชื่อนี้ถูกใช้งานแล้ว");
        } finally {
            setLoading(false);
        }
    }

    return {
        ClickRegister: {
            Register, name, password, nameChange, passwordChange, loading
        }
    }
}
