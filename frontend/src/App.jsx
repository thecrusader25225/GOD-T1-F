import { useState } from "react";
export default function App() {
  const [files, setFiles] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);
  const [outputImages, setOutputImages] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false)
  const [isShowingImages, setIsShowingImages] = useState(false);
  const [countFiles, setCountFiles] = useState(0);
  const [URL, _] = useState('http://localhost:5000')

  const handleFileChange = (event) => {
    setFiles(event.target.files);
    setCountFiles(event.target.files.length);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("images", file);
    }
    const response = await fetch(`${URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    await loadImages();
    console.log("Upload result:", result);
    setIsUploaded(true)
  };

  const loadImages = async () => {
    try {
      const res = await fetch(`${URL}/list`);
      const data = await res.json();
      console.log("Fetched images:", data);

      setOutputImages(data.outputImages);
      setOriginalImages(data.originalImages);
      setIsShowingImages(true)
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleDownloadAll = async () => {
    const link = document.createElement("a");
    link.href = `${URL}/download`;
    link.setAttribute("download", "output_images.zip");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-gray-800 text-white overflow-hidden">
      <div className="w-3/4 h-12 flex border items-center justify-around">
        {(isUploaded || isShowingImages) && (
          <button className="underline" onClick={() => window.location.reload()}>
            Upload more
          </button>
        )}

        <input
          id="fileInput"
          type="file"
          multiple
          accept="image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          className={`text-center ${!isUploaded && "underline cursor-pointer"}`}
          htmlFor="fileInput"
        >
          {isUploaded ? "Files Uploaded successfully!" : !isShowingImages && "Click to Upload File(s)"}
        </label>

        {!isShowingImages && <p>Files selected: {countFiles}</p>}

        {isShowingImages ? (
          <button className="underline" onClick={handleDownloadAll}>
            Download All
          </button>
        ) : (
          <button onClick={handleUpload} className="underline">
            Upload
          </button>
        )}

        <button className="underline" onClick={loadImages}>
          Show all uploaded files
        </button>
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
                    <img
                      className="w-96 h-w-96 object-cover rounded-lg"
                      src={`${URL}/original-images/${image}`}
                      alt={image}
                    />
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {outputImages[index] ? (
                      <img
                        className="w-96 h-w-96 object-cover rounded-lg"
                        src={`${URL}/output-images/${outputImages[index]}`}
                        alt={outputImages[index]}
                      />
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