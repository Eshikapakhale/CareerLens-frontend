import { createContext, useState, useEffect } from "react";
import { getme } from "./services/auth.api";

export const AuthContext = createContext()


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const getandSetUser = async () => {
            try {
                const data = await getme()
                if (data?.user) {
                    setUser(data.user)
                }
            } catch (err) {
                console.log("No active user session", err)
            } finally {
                setLoading(false)
            }
        }
        getandSetUser()
    }, [])


    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )

}