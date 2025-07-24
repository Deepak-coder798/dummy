import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children})=>{
     const [isValid, setIsValid] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(()=>{
     const Varification = async()=>{
       const token = localStorage.getItem('token');
       if(!token)
       {
          setIsValid(false);
          setLoading(false);
          return <Navigate to={'/login'} />
       }
       try{
           const response = await axios.get('http://localhost:5000/verify-token',{
            headers:{
                Authorization:`Bearer ${token}`
            }
           });
           if(response)
           {
            setIsValid(true);
           }
           else{
            setIsValid(false);
           }
       }
       catch(error){
          console.log(error);
          setIsValid(false);
       }
       finally{
          setLoading(false);
       }
    }

       Varification();
     },[])

if(loading)
{
   return( <div>
        Loading...!
    </div>);
}
else{
    console.log(isValid);
   return isValid? children : <Navigate to={'/login'} />
}

}

export default ProtectedRoute;