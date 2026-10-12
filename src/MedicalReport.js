import React, { useState } from "react";
import "./MedicalReport.css";

function MedicalReport() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a medical report first.");
      return;
    }

    alert("Report uploaded successfully!");
  };

  return (
    <div className="medical-report-page">

      <h1>Upload Medical Report</h1>

      <p>
        Upload your medical report in PDF or image format.
      </p>

      <div className="upload-box">

        <h2>Select Medical Report</h2>

        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
        />

        {file && (
          <p className="file-name">
            Selected File: {file.name}
          </p>
        )}

        <button onClick={handleUpload}>
          Upload Report
        </button>

      </div>

    </div>
  );
}

export default MedicalReport;