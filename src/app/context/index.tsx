'use client'

import { createContext, useContext, useState } from 'react'



const ValueContext = createContext<any>("")
export default function ValueProvider({ children, }: { children: React.ReactNode }) {

    const [namecontext, setNameContext] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const [profile, setProfile] = useState<string>("")

    return <ValueContext.Provider value={{ namecontext, setNameContext, image, setImage, profile, setProfile }}>{children}</ValueContext.Provider>
}

export function useValueContext() {
    return useContext(ValueContext)
}