// frontend/src/components/OCRUpload.jsx
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

function OCRUpload() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const extractText = () => {
    setLoading(true);
    Tesseract.recognize(
      image,
      'eng',
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      setText(text);
      setLoading(false);
    });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={extractText} disabled={!image || loading}>
        {loading ? 'Extracting...' : 'Extract Text from Resume'}
      </button>
      <pre>{text}</pre>
    </div>
  );
}

export default OCRUpload;
