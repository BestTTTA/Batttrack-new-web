// components/UploadForm.tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useValueContext } from '@/app/context';

const UploadForm: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const { setImage } = useValueContext();
    const [fileName, setFileName] = useState<string>('ยังไม่ได้เลือกรูปโปรไฟล์');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList) {
            const file = fileList[0];
            setFile(file);
            setFileName(file.name);
            setImagePreviewUrl(URL.createObjectURL(file)); 
        }
    };

    useEffect(() => {
        handleSubmit();
    },[file])

    const handleSubmit = async () => {
    
        const formData = new FormData();
        formData.append('file', file || "");
    
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/upload/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },  
            });
    
            console.log('File uploaded successfully:', response.data);
            setImage(response.data.image_url);  
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center items-center">
                <label htmlFor="file-upload" className="cursor-pointer h-32 w-32 border-2 border-gray-200 border-solid rounded-full flex items-center justify-center overflow-hidden">
                    {imagePreviewUrl ? (
                        <img src={imagePreviewUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <div className="text-white font-bold">เลือกโปรไฟล์</div>
                    )}
                </label>
                <input id="file-upload" type="file" onChange={handleFileChange} accept="image/png" className="hidden" />
                <p className="text-white text-[10px] text-center">{fileName}</p>
            </form>
        </div>
    );
};

export default UploadForm;
