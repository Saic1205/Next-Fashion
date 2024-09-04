"use client";//not in use
import React, { useRef, useState } from "react";

type UploadBtnProps = {
  onUploadFront: (uploadedImages: any[]) => void;
  onUploadBack: (uploadedImages: any[]) => void;
};

const UploadBtn: React.FC<UploadBtnProps> = ({
  onUploadFront,
  onUploadBack,
}) => {
  const frontFileInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const handleFrontUpload = () => {
    frontFileInputRef.current?.click();
  };

  const handleBackUpload = () => {
    backFileInputRef.current?.click();
  };

  const handleFrontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFrontPreview(URL.createObjectURL(file));
      onUploadFront(Array.from(files));
    }
  };

  const handleBackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setBackPreview(URL.createObjectURL(file));
      onUploadBack(Array.from(files));
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-center">
        {frontPreview ? (
          <div className="avatar">
            <div className="w-24 rounded">
              <img src={frontPreview} alt="Front Preview" />
            </div>
          </div>
        ) : (
          <div className="btn btn-primary" onClick={handleFrontUpload}>
            Upload Front Image
          </div>
        )}
      </div>
      <div className="flex flex-col items-center">
        {backPreview ? (
          <div className="avatar">
            <div className="w-24 rounded">
              <img src={backPreview} alt="Back Preview" />
            </div>
          </div>
        ) : (
          <div className="btn btn-primary btn-outline" onClick={handleBackUpload}>
            Upload Back Image
          </div>
        )}
      </div>
      <input
        type="file"
        name="front-image"
        ref={frontFileInputRef}
        onChange={handleFrontFileChange}
        style={{ display: "none" }}
        accept="image/*"
      />
      <input
        type="file"
        name="back-image"
        ref={backFileInputRef}
        onChange={handleBackFileChange}
        style={{ display: "none" }}
        accept="image/*"
      />
    </div>
  );
};

export default UploadBtn;
