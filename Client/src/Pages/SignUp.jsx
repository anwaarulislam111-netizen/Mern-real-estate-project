import React, { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import OAuth from '../Components/OAuth'



const SignUp = () => {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  const navigate=useNavigate();


//jb main hum form main values add kren ge to vo stah sath us ko handle krta jae ga
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
  console.log(formData)





  const handleSubmit = async (e) => { 
    e.preventDefault()
    setLoading(true)
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await axios.post(`${backendUrl}/api/auth/signup`, formData)

      if (res?.data?.success) {
        toast.success(res.data.message || 'Registered successfully')
        setFormData({})
        navigate('/sign-in')
      } else {
        toast.error(res?.data?.message || 'Registration failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }





  return (
    <div>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign Up
      </h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-lg mx-auto'>
       
        <input
          value={formData.username || ''}
          type='text'
          placeholder='username'
          id='username'
          onChange={handleChange}
          required
          className='border p-3 rounded-lg bg-white '
        />

        <input
          value={formData.email || ''}
          type='email'
          placeholder='email'
          id='email'
          onChange={handleChange}
          required
          className='border p-3 rounded-lg  bg-white'
        />

        <input
          value={formData.password || ''}
          type='password'
          placeholder='password'
          id='password'
          onChange={handleChange}
          required
          className='border p-3 rounded-lg  bg-white'
        />

        <button
          disabled={loading} onSubmit={handleSubmit}
          className='bg-slate-600 p-2 cursor-pointer text-white rounded-lg hover:bg-slate-500  disabled:opacity-80'
        >
          {loading ? 'Creating...' : 'SIGN UP'}
        </button>


        <OAuth />
      </form>



      <div className='flex gap-2 text-center max-w-lg mx-auto my-2'>
        <p> Have an account? </p>
        <span className='text-blue-500 underline'>
          <Link to={'/sign-in'}>Sign in</Link>
        </span>
      </div>
    </div>



  )
}

export default SignUp