import { useState } from 'react';
import { useUploadProductImageMutation } from '../../redux/api/productApiSlice';
import { toast } from 'react-toastify';

const ImageUpload = ({ onImageUpload, currentImage }) => {
  const [uploadProductImage] = useUploadProductImageMutation();
  const [image, setImage] = useState(currentImage || '');
  const [loading, setLoading] = useState(false);



  const validateImageUrl = (url) => {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' && 
               parsed.hostname.includes('cloudinary.com');
    } catch {
        return false;
    }
};

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  


  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
  }

  if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
  }

  const formData = new FormData();
  formData.append('image', file);

  setLoading(true);
  try {
      const result = await uploadProductImage(formData).unwrap();
      console.log('Server Response:', result);
        
      if (!result.image || !validateImageUrl(result.image)) {
          throw new Error('Invalid image URL received from server');
      }
      console.log('Image URL from response:', result.image);
      setImage(result.image);
      onImageUpload(result.image);
      toast.success('Image uploaded successfully');
  } catch (err) {
      console.error('Upload error:', err);
      
      toast.error(
          err.data?.message || 
          'Failed to upload image. Please try again.'
      );
      setImage('');
  } finally {
      setLoading(false);
  }
};
  return (
    <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                Product Image {loading && <span className="text-blue-500 ml-2">Uploading...</span>}
            </label>
            
            <div className="flex items-center space-x-4">
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    disabled={loading}
                />
            </div>

            {image && validateImageUrl(image) && (
                <div className="mt-2">
                    <img
                        src={image}
                        alt="Product preview"
                        className="h-32 w-32 object-cover rounded-md border"
                        onError={() => {
                            setImage('');
                            toast.error('Error loading image preview');
                        }}
                    />
                </div>
            )}
        </div>
  );
};

export default ImageUpload;