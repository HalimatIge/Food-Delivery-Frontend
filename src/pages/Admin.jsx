// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const AdminFoodDashboard = () => {
//   console.log("Component rendered ✅");
//   const [foods, setFoods] = useState([]);
//   const [form, setForm] = useState({ 
//     name: '', 
//     price: '', 
//     category: '', 
//     description: '',
//     // images: []
//   });
//   const [editId, setEditId] = useState(null);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);

//   const { user, authLoading } = useAuth();

//   if (authLoading) return <p>Loading...</p>;
//   if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

 

//   const fetchData = async () => {
//     try {
//       const res = await axios.get('http://localhost:5005/api/foodItems');
//       console.log("Fetched Foods:", res.data.foodItems);
//       setFoods(res.data.foodItems);
//     } catch (err) {
//       console.error('Error fetching food items:', err);
      
//     }
//   };

//    useEffect(() => { 
//     console.log("useEffect ran");
//     fetchData();
//     console.log("hfhfhhfh")

//    }, []);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleFileChange = (e) => {
//     setSelectedFiles(Array.from(e.target.files));
//   };

//   const uploadImages = async () => {
//     setIsUploading(true);
//     const uploadedImages = [];
    
//     for (const file of selectedFiles) {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('upload_preset', 'ml_default'); // Replace with your Cloudinary preset

//       try {
//         const response = await axios.post(
//           `https://api.cloudinary.com/v1_1/dtha8zsbd/image/upload`, // Replace with your Cloudinary cloud name
//           formData,
//           {
//             onUploadProgress: (progressEvent) => {
//               const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//               setUploadProgress(progress);
//             }
//           }
//         );
        
//         uploadedImages.push({
//           public_id: response.data.public_id,
//           url: response.data.secure_url,
//           name: file.name
//         });
//       } catch (err) {
//         console.error('Error uploading image:', err);
//         throw err;
//       }
//     }
    
//     setIsUploading(false);
//     return uploadedImages;
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     let images = [];
      
//   //     // Only upload if there are new files selected
//   //     if (selectedFiles.length > 0) {
//   //       images = await uploadImages();
//   //     } else if (editId && form.images) {
//   //       // If editing and no new files, keep existing images
//   //       images = form.images;
//   //     }

//   //     const payload = {
//   //       ...form,
//   //       images
//   //     };

//   //     if (editId) {
//   //       await axios.put(
//   //         `http://localhost:5005/api/foodItems/${editId}`,
//   //         payload,
//   //         { withCredentials: true }
//   //       );
//   //     } else {
//   //       await axios.post(
//   //         'http://localhost:5005/api/foodItems',
//   //         payload,
//   //         { withCredentials: true }
//   //       );
//   //     }

//   //     resetForm();
//   //     fetchData();
//   //   } catch (err) {
//   //     console.error('Error submitting form:', err);
//   //     alert(err.response?.data?.message || 'An error occurred');
//   //   }
//   // };


//   // React example

// const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   const formData = new FormData();
  
//   // Append all selected files
//   // for (let i = 0; i < selectedFiles.length; i++) {
//   //   formData.append('images', selectedFiles[i]); // Field name must match Multer config
//   // }
  
//   // Append other fields
//   formData.append('name', form.name);
//   formData.append('price', form.price);
//   formData.append('category', form.category);
//   formData.append('description', form.description);

//       selectedFiles.forEach((file) => formData.append("images", file));

//   try {
//     const response = await axios.post('/api/foodItems/add', formData, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           "Content-Type": "multipart/form-data",
//       },
//       withCredentials: true,
//     });
//     console.log('Success:', response.data);
//     resetForm();
//     fetchData();
//   } catch (error) {
//     console.error('Error:', error.response?.data || error.message);
//   }
// };


//   const resetForm = () => {
//     setForm({ 
//       name: '', 
//       price: '', 
//       category: '', 
//       description: '',
//       images: []
//     });
//     setSelectedFiles([]);
//     setEditId(null);
//     setUploadProgress(0);
//   };

//   const handleEdit = (item) => {
//     setForm(item);
//     setEditId(item._id);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this item?')) return;
    
//     try {
//       await axios.delete(
//         `http://localhost:5005/api/foodItems/${id}`,
//         { withCredentials: true }
//       );
//       fetchData();
//     } catch (err) {
//       console.error('Error deleting item:', err);
//       alert('Error deleting item');
//     }
//   };

//   const removeImage = (index) => {
//     const newImages = [...form.images];
//     newImages.splice(index, 1);
//     setForm({ ...form, images: newImages });
//   };

//   return (
//     <div className="p-6 mt-12">
//       <h1 className="text-2xl font-bold text-[#FF4C29] text-center">Admin Dashboard</h1>
//       <div className='text-center'>Welcome, {user?.role === "admin" ? `${user?.firstname}` : user?.name || "User"}!</div>
//       <br />
      
//       <div className="w-full md:w-1/2 px-6 py-4 border rounded-lg mx-auto">       
//         <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit Food' : 'Add Food'}</h2>
//         <form onSubmit={handleSubmit} className="grid gap-2 mb-8">
//           <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2" required />
          
//           <div className="border p-2">
//             <label className="block mb-2">Images (1-5):</label>
//             <input 
//               type="file" 
//               multiple 
//               accept="image/*" 
//               onChange={handleFileChange} 
//               className="mb-2"
//             />
            
//             {isUploading && (
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div 
//                   className="bg-blue-600 h-2.5 rounded-full" 
//                   style={{ width: `${uploadProgress}%` }}
//                 ></div>
//               </div>
//             )}
            
//             {/* Display existing images when editing */}
//             {editId && form.images?.length > 0 && (
//               <div className="mt-2">
//                 <p className="text-sm font-semibold">Current Images:</p>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {form.images.map((img, index) => (
//                     <div key={index} className="relative">
//                       <img 
//                         src={img.url} 
//                         alt={img.name} 
//                         className="w-16 h-16 object-cover rounded"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(index)}
//                         className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2" required />
//           <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="border p-2" required />
//           <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2" required />
          
//           <button 
//             type="submit" 
//             className="bg-[#FF4C29] text-white rounded-lg mt-2 p-2"
//             disabled={isUploading}
//           >
//             {isUploading ? 'Uploading...' : editId ? 'Update' : 'Add'} Food
//           </button>
//         </form>
//       </div>

//       <h3 className="text-xl font-semibold mb-4">Food Items</h3>
//       <div className="grid md:grid-cols-2 gap-4">
       

//   {foods.map((food) => (
//           <div key={food._id} className="border rounded p-4 shadow hover:shadow-md">
//             {food.images?.length > 0 && (
//               <div className="relative h-40 overflow-hidden mb-2">
//                 {/* <img 
//                   src={food.images[0].url} 
//                   alt={food.name} 
//                   className="w-full h-full object-cover rounded"
//                 /> */}
//                 {food.images.map((img, index) => (
//                   <img key={index} src={img.url} alt={img.name} className="w-16 h-16 object-cover rounded" />
//                 ))}
                
//               </div>
//             )}
//             <h4 className="font-bold text-lg">{food.name}</h4>
//             <p className="text-sm">{food.description}</p>
//             <p className="text-sm italic">{food.category} - ${food.price}</p>
//             <div className="mt-2 flex gap-2">
//               <button 
//                 onClick={() => handleEdit(food)} 
//                 className="bg-yellow-500 text-white px-3 py-1 rounded"
//               >
//                 Edit
//               </button>
//               <button 
//                 onClick={() => handleDelete(food._id)} 
//                 className="bg-red-600 text-white px-3 py-1 rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
        

//       </div>
//     </div>
//   );
// };

// export default AdminFoodDashboard;



