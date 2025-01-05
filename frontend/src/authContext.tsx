import React,{createContext,useState,useEffect,useContext} from "react";

const AuthContext = createContext({});

export const useAuth = ()=>{
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser,setCurrentUser] = useState<string | null>(null);

    useEffect(()=>{
        const userId = localStorage.getItem("userId");
        if(userId){
            setCurrentUser(userId);
        }
    },[]);

    const value = {
        currentUser,setCurrentUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
