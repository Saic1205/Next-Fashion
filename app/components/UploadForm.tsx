"use client";///not in use
import { useState, useRef, useEffect } from "react";

type UploadFormProps = {
  onUpload: (uploadedImages: any[]) => void;
};

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
      return () => {
        newPreviews.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [files]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please select files before submitting");
      return;
    }
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      alert("Files uploaded successfully");
      setFiles([]);
      setPreviews([]);
      onUpload(files);
    } catch (e: any) {
      console.error(e);
      alert("Error uploading files");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="file"
        name="files"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
      />
      {previews.length > 0 ? (
        <div>
          <ul style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {previews.map((preview, index) => (
              <li
                key={index}
                style={{ listStyle: "none", position: "relative" }}
              >
                <img
                  src={preview}
                  alt={`preview ${index}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-error btn-xs"
                  style={{ position: "absolute", top: "-8px", right: "-8px" }}
                  onClick={() => handleRemoveImage(index)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div
          className="btn btn-primary"
          onClick={() => fileInputRef.current?.click()}
        >
          Select Files
        </div>
      )}
      <div className="btn btn-primary">
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
};

export default UploadForm;
