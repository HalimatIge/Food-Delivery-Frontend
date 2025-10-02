import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/constants';

const AddEditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    price: '', 
    category: '', 
    description: '',
    available: true,
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const { user, authLoading, isInitialized } = useAuth();

  const categories = ["starter", "main", "dessert", "beverage", "appetizer", "special", "side"];

  if (authLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4C29]"></div>
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (id) {
      fetchFoodItem();
    }
  }, [id]);

  const fetchFoodItem = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/api/foodItems/${id}`, {
        withCredentials: true,
      });

      const food = res.data.foodItem;
      setForm({
        name: food.name || '',
        price: food.price || '',
        category: food.category || '',
        description: food.description || '',
        available: food.available ?? true,
        images: food.images || [],
      });
    } catch (err) {
      console.error("Error fetching food item:", err);
      setError("Failed to load food item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      setIsLoading(true);
      
      try {
        const compressedFiles = await Promise.all(
          files.map(file => compressImage(file))
        );
        
        setImageFiles(compressedFiles);
        
        const readers = compressedFiles.map(file => {
          const reader = new FileReader();
          return new Promise((resolve) => {
            reader.onload = (event) => resolve(event.target.result);
            reader.readAsDataURL(file);
          });
        });

        const previews = await Promise.all(readers);
        setForm(prev => ({ 
          ...prev, 
          imagePreviews: previews 
        }));
      } catch (error) {
        console.error('Image compression failed:', error);
        setError('Failed to process images');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...form.imagePreviews || []];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImageFiles(newFiles);
    setForm(prev => ({ ...prev, imagePreviews: newPreviews }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append('name', form.name);
      formData.append('price', String(form.price));
      formData.append('category', form.category);
      formData.append('description', form.description);
      formData.append('available', String(form.available));

      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });
      }

      if (imageFiles.length === 0 && form.images?.length > 0) {
        formData.append('existingImages', JSON.stringify(form.images));
      }

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      };

      if (id) {
        await axios.put(`${API_URL}/api/foodItems/${id}`, formData, config);
      } else {
        await axios.post(`${API_URL}/api/foodItems/add`, formData, config);
      }

      navigate('/admin/foods');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (id && isLoading) return <div className="text-center py-8">Loading food item...</div>;
  if (id && error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#FF4C29]">
          {id ? 'Edit Food Item' : 'Add New Food Item'}
        </h1>
        <button 
          onClick={() => navigate('/admin/foods')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Food Name</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              className="w-full border p-2 rounded" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Food Images {!id && '(At least one required)'}
            </label>
            <input 
              type="file" 
              name="images"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full border p-2 rounded"
              multiple
              required={!id && imageFiles.length === 0}
            />
            <p className="text-xs text-gray-500 mt-1">
              You can upload multiple images (JPEG, PNG)
            </p>
            
           
            <div className="mt-4 grid grid-cols-3 gap-2">
         
              {form.images?.map((img, index) => (
                <div key={`existing-${index}`} className="relative">
                  <img 
                    src={img.url} 
                    alt={`Preview ${index}`} 
                    className="h-24 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedImages = [...form.images];
                      updatedImages.splice(index, 1);
                      setForm(prev => ({ ...prev, images: updatedImages }));
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              
             
              {(form.imagePreviews || []).map((preview, index) => (
                <div key={`new-${index}`} className="relative">
                  <img 
                    src={preview} 
                    alt={`Preview ${index}`} 
                    className="h-24 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price (₦)</label>
            <input 
              name="price" 
              type="number" 
              value={form.price} 
              onChange={handleChange} 
              className="w-full border p-2 rounded" 
              min="0"
              step="0.01"
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="available"
              name="available"
              checked={form.available}
              onChange={(e) => setForm({...form, available: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="available">Available</label>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              className="w-full border p-2 rounded" 
              rows="3"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-[#FF4C29] text-white rounded-lg p-3 hover:bg-[#e04427] transition mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : id ? 'Update Food' : 'Add Food'}
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF4C29]"></div>
              <span>Processing images...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEditFood;