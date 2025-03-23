import { useState } from "react";

const UploadPage = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("images", file);
    }

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("Upload result:", result);
  };

  return (
    <div>
      <input type="file" multiple accept="image/jpeg" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadPage;
