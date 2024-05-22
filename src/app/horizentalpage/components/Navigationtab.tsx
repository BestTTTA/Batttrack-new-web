import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoQrCode } from "react-icons/io5";
import { FiHome } from "react-icons/fi";
import { FaListCheck } from "react-icons/fa6";
import { useValueContext } from '@/app/context';
import { MdOutlineCreateNewFolder } from "react-icons/md";
import Image from 'next/image';

const Navigationtab = () => {
    const [click, setClick] = useState("#home_page")
    const isActive = (id: string): boolean => {
        return click === id;

    };
    const { profile } = useValueContext()
    if (profile) {
        localStorage.setItem("profile", profile)
    }
    const [useProfile, setUseProfile] = useState<string>("")
    const [name, setName] = useState<string>("");

    useEffect(() => {
        const localProfile = localStorage.getItem("profile")
        const localName = localStorage.getItem("Name") || "";
        setName(localName || "")
        setUseProfile(localProfile || "")
    }, [])

    const nav = [
        { id: "#home_page", label: "Home", Icon: FiHome },
        { id: "#scan_page", label: "Scan", Icon: IoQrCode },
        { id: "#check_page", label: "List", Icon: FaListCheck },
        { id: "#create_page", label: "Create", Icon: MdOutlineCreateNewFolder },
    ];

    return (
        <div className="fixed flex inset-x-0 bottom-0 bg-gray-800 text-white p-2 shadow-gray-900">
            <div className="flex w-full justify-evenly max-w-md mx-auto">
                {nav.map(item => (
                    <Link href={item.id} key={item.id} onClick={() => { setClick(item.id) }}>
                        <div className={`flex w-15 h-fit p-2 flex-col items-center transition duration-300 ease-in-out ${isActive(item.id) ? "text-orange-500 bg-gray-900 scale-105 rounded-md" : "hover:scale-110"}`}>
                            <item.Icon size={30} />
                            <p className=" text-[9px]">{item.label}</p>
                        </div>
                    </Link>
                ))}
                <Link href={"#profile_page"} onClick={() => { setClick("#profile_page") }} className='flex w-15 h-15 flex-col items-center justify-center'>
                    <div className={`flex rounded-full p-2 flex-col items-center transition duration-300 ease-in-out ${isActive("#profile_page") ? "text-orange-500 bg-gray-900 scale-105 rounded-md" : "hover:scale-110"}`}>
                        <Image
                            src={`${useProfile}`}
                            alt="Picture of the author"
                            width={30}
                            height={30} 
                            className='rounded-full h-6 w-6 border'
                        />
                        <p className=" text-[9px]">{name}</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Navigationtab;
