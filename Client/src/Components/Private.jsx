import React from 'react'
import { Outlet ,Navigate} from 'react-router-dom'

//AGAR USE EXIST KRTA HO MEAN SIGNED IN HO TB HEE US KO PROFILE WALA PAGE ACCESS KRNE DO.. AGAR SIGNIN NHI HAI TO USKO SIGNIN WALE PAGE PE REDIRECT KR DO AGAR /PROFILE ACCESS KRNA CHAHE 

const Private = () => {
    const storedUser = localStorage.getItem('currentUser')
    const currentUser = storedUser ? JSON.parse(storedUser) : null
 
  return (
    currentUser? <Outlet /> : <Navigate to={'/sign-in'}/>
  )
}

export default Private