import React, { useEffect } from 'react'
import { useState } from 'react'
import { supabase } from '../supabase.js';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_IMAGES = 6;
const STORAGE_BUCKET = 'mern_state_bucket';

const UpdateListing = () => {
  const navigate = useNavigate();

    const[files,setFiles]=useState([])

    console.log(files)

    const [formData, setFormData] = useState({
      imageUrls: [],
      name: "",
      description: "",
      address: "",
      type: "rent", 
      bedrooms: 1,
      bathrooms: 1,
      regularPrice: 50, 
      discountPrice: 0,
      offer: false,
      parking: false,
      furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error,setError] = useState(false);
  const [loading,setLoading] = useState(false);
    


  const storedUser = localStorage.getItem('currentUser')
  const currentUser = storedUser ? JSON.parse(storedUser) : null




const params=useParams()


//THIS IS THE MAIN FUNCTION FOR THIS UPDATE LISTING PAGE AS WHEN WE CLICK UPDATE ON ANY LISTING THEN UPDATE LISTING PAGE WILLL APPEAR AND WE WILL
//USE CREATE LISTING PAGE WITH SLIGT CHANGINGS ACCORDING TO OUR REQUIREMENT JESE K BAQI SARA CODE CREATE LISTING WALE PAGE SSE UTHA LIYA AND SLIGHT CHANGINGS KR DEE JESE K CRETE LISTING CHANGE KR K UPDATE LISTING KR DI
//MAIN CHHEZ: IS FUNCTION MAIN KI HAI K JO US KI DEFAULT VALUES THEEEN WO FORM MAIN PUT KR DEE HAIN
useEffect(() => {
  const fetchListing = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const res = await axios.get(`${backendUrl}/api/listing/get/${params.listingId}`);
      const data = res?.data;

      if (data?.success === false) {
        setError(data.message);
        return;
      }

      setFormData({
        imageUrls: data.imageUrls || [],
        name: data.name || '',
        description: data.description || '',
        address: data.address || '',
        type: data.type || 'rent',
        bedrooms: data.bedrooms || 1,
        bathrooms: data.bathrooms || 1,
        regularPrice: data.regularPrice || 50,
        discountPrice: data.discountPrice || 0,
        offer: data.offer || false,
        parking: data.parking || false,
        furnished: data.furnished || false,
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load listing');
    }
  };

  if (params.listingId) {
    fetchListing();
  }
}, [params.listingId]);
















  const handleImageSubmit = () => {

    // atleast 1 image and Total images (old + new) ≤ 6
    if (files.length > 0 && files.length + formData.imageUrls.length <= MAX_IMAGES) {
      const invalidFile = files.find(
        (file) => !file.type.startsWith('image/') || file.size > MAX_IMAGE_SIZE_BYTES
      );

      if (invalidFile) {
        setImageUploadError('Please upload valid images up to 2 MB each');
        return;
      }

      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises) //Wait until ALL uploads finish
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),  //Add them to existing imageUrls
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError(err?.message || "Image upload failed. Please try again.");
          setUploading(false);
        });
    } else if (files.length === 0) {
        setImageUploadError("Please select an image to upload");
    } else {
      setImageUploadError(`You can only upload ${MAX_IMAGES} images per listing`);
      setUploading(false);
    }
  };









  

//storing in supabase
    const storeImage = async (file) => {
    try {
      const fileName = new Date().getTime() + "_" + file.name;     //hr file k peeche time lga diya for uniqueness
      const filePath = `listings/${fileName}`;

      // Upload to Supabase
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)                    //top pe define kiya hai : const STORAGE_BUCKET = 'mern_state_bucket';
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        throw new Error(error.message || 'Upload failed');
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to generate image URL');
      }

      return urlData.publicUrl;
    } catch (error) {
      throw new Error(error?.message || 'Image upload failed');
    }
  };








// jb pictures show ho ri hon gi and delete dbaen ge to ye run kre ga
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };








// q k values different hain to sb k hisaab se chalna pre ga q k kuch text hain kuch number kuch boolean etc etc
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") { //aik time pe ya to hum sell ko tick kr skte hain ya to rent ko not both together
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };








//jb hum create listing wala button dbaen ge to ye wala submit kren ge
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!currentUser?._id) return setError('Please sign in first');

      // 3. Prevent submission if there are no images or uploading is in progress
      if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
      
      // 4. Validate that discount price is actually a discount
      if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price');

      setLoading(true);
      setError(false);
      



    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const res = await axios.post(
      `${backendUrl}/api/listing/update/${params.listingId}`,
      {
        ...formData,
        userRef: currentUser._id,
      },
      {
        withCredentials: true,
      }
    );

      const data = res?.data;
      setLoading(false);
      
      if (data.success === false) {
        setError(data.message);
      } else {
        const updatedListingId = data?.listing?._id || params.listingId;
        navigate(`/listing/${updatedListingId}`);
      }
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
      setLoading(false);
    }
  };












  return (
    <main className='p-3 max-w-3xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Updtae a Listing</h1>

        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row'>
            <div className='flex flex-col gap-4 flex-1'>

                <input type="text" placeholder='Name' id='name' onChange={handleChange} value={formData.name} className='bg-white p-3 rounded-lg' required />
            
                <textarea type="text" placeholder='Description' onChange={handleChange} value={formData.description} id='description'  className='bg-white p-3 rounded-lg' required />

                <input type="text" placeholder='Address' id='address' onChange={handleChange} value={formData.address}  className='bg-white p-3 rounded-lg' required />





            <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2'>
                     <input type="checkbox" id='sale' onChange={handleChange} checked={formData.type==='sale'} className='w-5'/>
                     <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                     <input type="checkbox" id='rent' onChange={handleChange} checked={formData.type==='rent'} className='w-5'/>
                     <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                     <input type="checkbox" id='parking' onChange={handleChange} checked={formData.parking} className='w-5'/>
                     <span>Parking Spot</span>
                </div>
                <div className='flex gap-2'>
                     <input type="checkbox" id='furnished' onChange={handleChange} checked={formData.furnished} className='w-5'/>
                     <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                     <input type="checkbox" id='offer' onChange={handleChange} checked={formData.offer} className='w-5'/>
                     <span>Offer</span>
                </div>
            </div>




            <div className="flex flex-wrap gap-6">
  <div className="flex gap-2 items-center">
    <input
      type="number"
      id="bedrooms"
      min="1"
      onChange={handleChange}
      value={formData.bedrooms}
      required
      className="p-2 w-20 border bg-white border-gray-300 rounded-lg"
    />
    <p>Beds</p>
  </div>

  <div className="flex gap-2 items-center">
    <input
      type="number"
      id="bathrooms"
      min="1"
      onChange={handleChange}
      value={formData.bathrooms}
      required
      className="p-2 w-20 border bg-white border-gray-300 rounded-lg"
    />
    <p>Baths</p>
  </div>

  <div className="flex gap-2 items-center">
    <input
      type="number"
      id="regularPrice"
      min="1"
      onChange={handleChange}
      value={formData.regularPrice}
      required
      className="p-2 w-32 border bg-white border-gray-300 rounded-lg"
    />
    <p>Regular Price ($ / month)</p>
  </div>

  <div className="flex gap-2 items-center">
    <input
      type="number"
      id="discountPrice"
      onChange={handleChange}
      value={formData.discountPrice}
      required
      className="p-2 w-32 border bg-white border-gray-300 rounded-lg"
    />
    <p>Discount Price ($ / month)</p>
  </div>
</div>




            </div>  {/* //end of left div for big screens*/}


            

            <div className='flex flex-col ml-6 flex-1 gap-4'>  {/* start of right div for small screens  */}
                <p className='font-semibold pt-3'>Images: 
                    <span className='font-normal text-gray-600 ml-2'> The first image will be the cover (max 6)</span>
                </p>

                <div className='flex gap-3'>
                    <input onChange={(e)=>setFiles(Array.from(e.target.files || []))}  type="file" id="images"  accept="image/*"  multiple className='p-3 bg-white rounded-lg'/>
                    <button type='button' onClick={handleImageSubmit} disabled={uploading} className='p-3 text-green-700 border border-green-700 rounded-lg hover:bg-green-100 cursor-pointer disabled:opacity-70'>{uploading ? 'UPLOADING...' : 'UPLOAD'}</button>
                </div>
            
{/* JO ERROR AAYE GA IDHAR DIKHANA MEAN AGAR PICTURES 6 SE ZYADA HAIN */}
            <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
            



            {/* Display the uploaded images */}
           {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}




            <button 
            disabled={loading || uploading} 
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
            </div>

        </form>
    </main>
  )
}

export default UpdateListing