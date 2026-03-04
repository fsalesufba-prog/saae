import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  onRemove?: () => void;
  currentImage?: string;
  accept?: string;
  maxSize?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onRemove,
  currentImage,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      setError(`Arquivo muito grande. Máximo: ${maxSize / 1024 / 1024}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    onUpload(file);
    setError('');
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <FaCloudUploadAlt />
        <p>Clique para fazer upload</p>
        <small>ou arraste e solte</small>
        <small>Formatos: JPG, PNG, GIF (max {maxSize / 1024 / 1024}MB)</small>
      </label>

      {error && <div className="error-message">{error}</div>}

      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Preview" />
          <button onClick={handleRemove} type="button">
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;