import { useState } from 'react';
import { useUploadProductImageMutation } from '../../redux/api/productApiSlice';
import { toast } from 'react-toastify';

const ImageUpload = ({ onImageUpload, currentImage }) => {
  const [uploadProductImage] = useUploadProductImageMutation();
  const [image, setImage] = useState(currentImage || '');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    console.log('File selected:', file);

    const formData = new FormData();
    formData.append('image', file);
    
    // Log the FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    try {
      console.log('Sending request to upload image');
      const response = await uploadProductImage(formData).unwrap();
      console.log('Upload response:', response);
      setImage(response.image);
      onImageUpload(response.image);
      toast.success('Image uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err?.data?.message || 'Error uploading image');
    }
  };
   
  return (
    <div>
      <input type="file" name="image" onChange={handleFileChange} accept="image/*" />
      {image && (
        <div className="mt-2">
          <img src={image || "/placeholder.svg"} alt="Product preview" className="h-32 w-32 object-cover rounded-md" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;