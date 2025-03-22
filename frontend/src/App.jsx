import { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Server response:", data);
      setResponse(JSON.stringify(data, null, 2)); // Pretty print JSON response
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button className="mt-2 p-2 bg-blue-500 text-white" onClick={handleUpload}>
        Upload Image
      </button>

    </div>
  );
}
