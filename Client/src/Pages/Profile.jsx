import React, { useState, useEffect } from 'react'
import { useRef } from 'react'
import { supabase } from "../supabase.js";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate , Link} from 'react-router-dom';


const Profile = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('currentUser')
  const currentUser = storedUser ? JSON.parse(storedUser) : null


  const [file,setFile] =useState(undefined)
  // console.log(file);


  const [fileUploadError, setFileUploadError] = useState('');
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [showListingError,setshowListingError]=useState(false);
  const [userListings,setUserListings] = useState([]);


  const fileRef=useRef(null);




//jb jb file appload kren ge mean profuile pic tb run kre ga
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file])


  



 //THIS FUNCTION WE HAVE USED IN ABOVE USEEFFECT WHICH WILL RUN WHEN FILE IS UPLOADED
  const handleFileUpload = async (file) => {

  setFileUploadError('');
  setUpdateSuccess(false);


  try {
    const fileName = new Date().getTime() + "_" + file.name;       //file k name se pehle time add kr diya k unique rhe
    const filePath = `avatars/${fileName}`;                        //ko meri bucket hai us main avatar folder bne ga and us k andar save hon ge

    const { data, error } = await supabase.storage
      .from("mern_state_bucket") // ✅ updated bucket name
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("mern_state_bucket") // ✅ updated here also
      .getPublicUrl(filePath);

    setFormData((prev) => ({ ...prev, avatar: urlData.publicUrl }));
  } catch (error) {
    setFileUploadError(error?.message || 'File upload failed');
    console.error('Supabase upload error:', error);
  }
};










// sb inputs pe onchange pe ye wala function lga diya.. jitni value change ho gi wo upadte ho gi baqi data pichla hee rhe ga
const handleChange=(e)=>{
  setFormData({...formData, [e.target.id]: e.target.value})
}

// console.log(formData)









// jb update wala button dbaen ge to ye wala function call kre ge
const handleSubmit= async (e)=>{
  e.preventDefault();
  setUpdateSuccess(false);


  if (fileUploadError) {
    toast.error('Please fix file upload issue before updating');
    return;
  }

  if (!Object.keys(formData).length) {
    toast.info('No changes to update');
    return;
  }

  setUpdating(true);
  try{
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const res = await axios.post(`${backendUrl}/api/user/update/${currentUser._id}`, formData, {
        withCredentials: true,
      });

      const data = res?.data;

      if(data?.success){
        if (data?.user) {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        setUpdateSuccess(true);
        setFormData((prev) => ({ ...prev, password: '' }));                //this line clears the password field in your form after the profile is updated.
        toast.success(data?.message || 'Profile updated successfully');
      } else {
        toast.error(data?.message || 'Failed to update profile');
      }
      
  }
  catch(err){
    toast.error(err.response?.data?.message || err.message || 'An error occurred while updating profile');
  }
  finally {
    setUpdating(false);
  }
}











// jb deleteUser wala dbaen ge jo red main likha a to us pe onClick pe ye functionlgaya a
const handleDeleteUser= async () =>{

  const isConfirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
  if (!isConfirmed) return;

  setDeleting(true);
  try{
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const res = await axios.post(`${backendUrl}/api/user/delete/${currentUser._id}`, {}, {
        withCredentials: true,
      });

      const data = res?.data;

      localStorage.removeItem('currentUser');
      toast.success(data?.message || (typeof data === 'string' ? data : 'Account deleted successfully'));
      navigate('/sign-in');
  }
  catch(err){
    toast.error(err.response?.data?.message || err.message || 'Failed to delete account');
  }
  finally {
    setDeleting(false);
  }
}










//JB SIGN OUT KREN GE TO YE FUNCTION RUN KRE GA
const handleSignOut=async()=>{

  setSigningOut(true);
  try{
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const res = await axios.get(`${backendUrl}/api/auth/signout`, {
      withCredentials: true,
    });

    const data = res?.data;
    localStorage.removeItem('currentUser');
    toast.success(data?.message || (typeof data === 'string' ? data : 'Signed out successfully'));
    navigate('/sign-in');


  }
  catch(err){
    toast.error(err.response?.data?.message || err.message || 'Failed to sign out');

  }
  finally {
    setSigningOut(false);
  }
}
















const handleShowListings= async ()=>{
  try{
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const res = await axios.get(`${backendUrl}/api/user/listings/${currentUser._id}`, {
      withCredentials: true,
    });

    const data = res?.data;

    if(data?.success===false){
      setshowListingError(true)
      return;
    }

    setUserListings(Array.isArray(data) ? data : []);
    setshowListingError(false);
  }
  catch(err){
    setshowListingError(true);
  }
}








//jb listings show krvaen ge and delete and view wala button show hoga to delete wale button pe ye wala function chalaen ge hum
const handleListingDelete= async (listingID)=>{
  try{
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const res = await axios.delete(`${backendUrl}/api/listing/delete/${listingID}`, {
      withCredentials: true,
    });


    const data = res?.data;

    if(data?.success===false){
      console.log(data.message)
      return;
    }


//show every listing except the one jiski listing id    listingID(jo hum ne req main bheji hai)   us se match krti ho
    setUserListings((prev)=>prev.filter((listing)=> listing._id !== listingID))


  }
  catch(err){
    toast.error(err.message)
  }
}












  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-5 max-w-lg mx-auto'>
                                                                  {/* AGAR ZYADA FILES SELECT KRE TO FIRST WALI LO IS LIYE [0] */}
        <input type="file" ref={fileRef} hidden accept='image/*' onChange={(e)=>setFile(e.target.files[0])}/> 

{/* USEREF USE KR K IMAGE UPLOAD WALI FUNCTIONALITY PROFILE PIC PE ADD KR DI K JB PROFILE PIC PE CLICK KREN TO FILE SELECT HO SKE */}
{/* src={formData.avatar || currentUser?.avatar} in below line taa k agar nyi pic ho to wo uplload hojae */}
        <img onClick={()=>fileRef.current.click()}  src={formData.avatar || currentUser?.avatar} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' alt="" />

        {fileUploadError && <p className='text-sm self-center text-red-700'>{fileUploadError}</p>}

        <input type="text" placeholder='username'  id='username'  onChange={handleChange} defaultValue={currentUser.username}  className='bg-white p-3  rounded-lg'  />

        <input type="email" placeholder='email' id='email' onChange={handleChange} defaultValue={currentUser.email}  className='bg-white p-3  rounded-lg'  />

        <input type="password" placeholder='password' id='password' value={formData.password || ''} onChange={handleChange} className='bg-white p-3  rounded-lg'  />

        <button disabled={updating} className=' bg-slate-700 hover:bg-slate-500 text-white rounded-xl p-3 disabled:opacity-70' > {updating ? 'UPDATING...' : 'UPDATE'} </button>

      <Link to={'/create-listing'} className='bg-green-700 text-white p-3 rounded-xl text-center hover:bg-green-400'>
      CREATE LISTING
      </Link>
      </form>


      {updateSuccess && <p className='text-sm text-green-700 text-center mt-3'>Profile updated successfully.</p>}

      <div className='flex justify-between'>
        <span onClick={handleDeleteUser} className='text-red-700 mt-3 cursor-pointer'> {deleting ? 'Deleting...' : 'Delete Account'}</span>
        <span onClick={handleSignOut} className='text-red-700 mt-3 cursor-pointer'> {signingOut ? 'Signing Out...' : 'Sign Out'}</span>
      </div>



      <button onClick={handleShowListings} className='text-green-700 w-full cursor-pointer'> SHOW LISTINGS</button>

      {userListings && userListings.length > 0 && 
      <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 my-7 text-2xl font-semibold">Your Listings</h1>

          {userListings.map((listing)=>(
          <div key={listing._id} className="gap-4 border rounded-lg p-3 flex justify-between items-center"> 
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-16 object-contain"/>
              </Link>

              <Link className="text-slate-700 font-semibold  hover:underline truncate flex-1" to={`/listing/${listing._id}`}>
                  <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col items-center">
                <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700  cursor-pointer">DELETE</button>
                
                <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 cursor-pointer'>EDIT</button>
                </Link>
                
              </div>
        </div>
      ))}  
    </div>}

    {showListingError && <p className='text-red-700 mt-3'>Failed to load listings</p>}
    </div>
  )
}

export default Profile