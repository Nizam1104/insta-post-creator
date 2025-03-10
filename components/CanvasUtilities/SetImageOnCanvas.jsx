"use client"

import { useState, useCallback } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import compressImage from "@/services/compressImage"
import { imageService } from '@/services/imageService';

export default function SetImageOnCanvas () {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleAddImage = (url) => {
    imageService.addImage(url);
    setImageUrl('');
  };

  const handleFileUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      handleAddImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        // setError('Please upload a valid image file');
        return;
      }
      // const imageFile = await compressImage(file);
      const compressedFile = await compressImage(file, {
        maxWidth: 800,      // Optional: adjust maximum width
        maxHeight: 800,     // Optional: adjust maximum height
        quality: 0.5,       // Optional: adjust quality (0.1 = maximum compression)
        mimeType: 'image/jpeg' // Optional: choose output format
      });
      handleFileUpload(compressedFile);
    }
  };

  return (
    <div className="bg-gray-900 p-1 rounded-md">
      <h2 className='text-gray-400 font-semibold text-sm'>
        Add Image
      </h2>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-1 border-2 border-dashed rounded-md text-center mt-1 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <p className="text-gray-600 text-sm">Drag & drop an image here</p>
        <p className="text-gray-400 text-xs mt-1">or</p>
        <Label className="px-1.5 py-[1px] bg-gray-400 text-gray-800 rounded-sm text-sm">
          Browse Files
          <Input 
            type="file" 
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Label>
      </div>

      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};
