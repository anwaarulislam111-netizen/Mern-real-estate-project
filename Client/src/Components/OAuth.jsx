import React from 'react'
import { toast } from 'react-toastify'
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from '../firebase'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const navigate = useNavigate();

    const handleGoogleClick= async ()=>{
        try{

            const provider= new GoogleAuthProvider();
            const auth=getAuth(app)     //ye app wo hai jo hum ne firebase.js se import ki thi
            

            const result= await signInWithPopup(auth,provider);
            // console.log(result);

            const googlePhoto =
                result?.user?.photoURL ||
                result?.user?.reloadUserInfo?.photoUrl ||
                result?._tokenResponse?.photoUrl ||
                '';


                        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
                        const res = await axios.post(
                            `${backendUrl}/api/auth/google`,
                            {name: result.user.displayName, email: result.user.email, photo: googlePhoto},
                            { withCredentials: true, timeout: 10000 }
                        )
                        

                        //  store Google login user in localStorage.
                        if (res?.data?.user) {
                            const userWithGoogleAvatar = {
                                ...res.data.user,
                                avatar: googlePhoto || res.data.user.avatar,
                            }
                            localStorage.setItem('currentUser', JSON.stringify(userWithGoogleAvatar))
                        }


                        toast.success(res.data.message || 'Request completed successfully')
                        navigate('/')
            
        }
        catch(err){
            toast.error(err.response?.data?.message || err.message || 'An error occurred')
        }
    }



  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 cursor-pointer text-white p-3 rounded-lg hover:bg-red-500'>
        CONTINUE WITH GOOGLE
    </button>
  )
}

export default OAuth