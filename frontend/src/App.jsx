import { useState } from "react";
export default function App() {
  const [files, setFiles] = useState([]);
  const [originalImages, setOriginalImages] = useState([])
  const [outputImages, setOutputImages] = useState([])

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("images", file);
    }
    const response = await fetch(`http://localhost:5000/upload`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    await loadImages()
    console.log("Upload result:", result);
  };

  const loadImages = async () => {
    try {
      const res = await fetch('http://localhost:5000/list');
      const data = await res.json();
      console.log("Fetched images:", data);

      setOutputImages(data.outputImages);
      setOriginalImages(data.originalImages)

    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };


  return (
    <div className="w-screen h-screen flex flex-col items-center bg-gray-800 text-white overflow-hidden">
      <div className="w-3/4 h-12 flex border items-center justify-center">
        <input id="fileInput" type="file" multiple accept="image/jpeg" onChange={handleFileChange} className="hidden" />
        <label className="cursor-pointer w-3/4 text-center" htmlFor="fileInput">Click to Upload File(s)</label>
        <button onClick={() => { handleUpload(); }} className="">Upload</button>

        {/* temporary */}
        <button onClick={loadImages}>Fetch</button>
      </div>
      <div className="w-full h-full flex flex-col items-center overflow-auto">
        <div className="w-full h-full flex flex-col items-center">
          <table className="border-collapse border border-gray-500 w-3/4 mt-4">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="border border-gray-500 px-4 py-2">Original Images</th>
                <th className="border border-gray-500 px-4 py-2">Processed Images</th>
              </tr>
            </thead>
            <tbody>
              {originalImages.map((image, index) => (
                <tr key={index} className="text-center border border-gray-500">
                  <td className="border border-gray-500 px-4 py-2">
                    <img className="w-96 h-w-96 object-cover rounded-lg"
                      src={`http://localhost:5000/original-images/${image}`}
                      alt={image} />
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {outputImages[index] ? (
                      <img className="w-96 h-w-96 object-cover rounded-lg"
                        src={`http://localhost:5000/output-images/${outputImages[index]}`}
                        alt={outputImages[index]} />
                    ) : (
                      <span className="text-gray-400">Processing...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}