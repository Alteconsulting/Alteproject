import React, { useState } from "react";
import {
  CloudArrowDownIcon,
  DocumentIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import ToastNotification, { ToastMessage } from "../../../ui/ToastNotification";
import { API } from "../../../config";
import useFreelancerAuth from "../auth/useFreelancerAuth";


const DocumentSection = () => {
  const { user } = useFreelancerAuth(); 
  const [resumeFiles, setResumeFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [certificateFiles, setCertificateFiles] = useState([]);

  // Handle multiple resume uploads
  const handleResumeUpload = (e) => {
    const files = Array.from(e.target.files);
    setResumeFiles((prevFiles) => [...prevFiles, ...files]); // Add new resumes to the existing list
  };
  const uploadResume = async () => {
    // Validate files
    if (resumeFiles.length === 0) {
      toast.error('Please select a resume to upload');
      return;
    }

    // Get the first file (or you can modify to handle multiple files)
    const resumeFile = resumeFiles[0];

    // Validate file type
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + resumeFile.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error('Invalid file type. Only PDF and Word documents are allowed.');
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('Resume', resumeFile);

    try {
      setIsUploading(true);
      
      // Replace with your actual user ID mechanism
      const userId = user?.id; 
      
      // Replace with your actual API endpoint
      const response = await axios.post(`${API}/api/Alte/WorkExperiences/resume/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Success handling
      toast.success(response.data.message);
      
      // Optional: Clear uploaded files after successful upload
      setResumeFiles([]);
    } catch (error) {
      // Error handling
      const errorMessage = error.response?.data || 'Failed to upload resume';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle multiple certificate uploads
  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    setCertificateFiles((prevFiles) => [...prevFiles, ...files]); // Add new files to the existing list
  };

  // Handle drag and drop for resume uploads
  const handleResumeDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setResumeFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Handle drag and drop for certificate uploads
  const handleCertificateDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setCertificateFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Remove individual resume file
  const removeResumeFile = (index) => {
    setResumeFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    toast.success(<ToastMessage message="Your resume has been removed." />);
  };

  // Remove individual certificate file
  const removeCertificateFile = (index) => {
    setCertificateFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    toast.success(
      <ToastMessage message="Your certificate has been removed." />,
    );
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-[#FBFFFE] p-6">
      <ToastNotification />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Resume Upload Section */}
        <div>
          <h3 className="mb-1 text-xl font-semibold">Resume</h3>
          <p className="text-gray-600 mb-3 text-sm">
            PDF (Preferred), DOCX, DOX, RTF, TXT up to 1mb
          </p>
          <div
            className="border-green-700 bg-gray-100 cursor-pointer rounded-lg border-2 border-dashed bg-pry-50 p-6 text-center"
            onDrop={handleResumeDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              type="file"
              id="resumeUpload"
              className="hidden"
              onChange={handleResumeUpload}
              multiple
            />
            <label htmlFor="resumeUpload" className="cursor-pointer">
              <CloudArrowDownIcon className="text-gray-700 mx-auto mb-2 h-8 w-8" />
              <p className="text-gray-700">
                Drag or{" "}
                <span className="cursor-pointer font-semibold text-sec-600">
                  upload
                </span>{" "}
                Resume
              </p>
            </label>
          </div>

          {/* Display uploaded resume and remove button */}
          {resumeFiles.map((file, index) => (
            <div
              key={index}
              className="mt-3 flex items-center justify-between rounded-md border bg-white p-2"
            >
              <div className="flex items-center space-x-2">
                <DocumentIcon className="text-gray-500 h-6 w-6" />
                <p className="text-gray-700 truncate text-base md:text-xl">
                  {file.name}
                </p>{" "}
              </div>
              <button
                className="text-red-500 font-semibold"
                onClick={() => removeResumeFile(index)}
              >
                <XCircleIcon className="h-6 w-6 text-error-400" />
              </button>
            </div>
          ))}
          {/* Upload Button */}
          {resumeFiles.length > 0 && (
            <button 
              onClick={uploadResume}
              disabled={isUploading}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          )}
        </div>

        {/* Certificate Upload Section */}
        <div>
          <h3 className="mb-1 text-xl font-semibold">Certificate</h3>
          <p className="text-gray-600 mb-3 text-sm">
            Upload your certifications
          </p>
          <div
            className="border-green-700 bg-gray-100 cursor-pointer rounded-lg border-2 border-dashed bg-pry-50 p-6 text-center"
            onDrop={handleCertificateDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              type="file"
              id="certificateUpload"
              className="hidden"
              onChange={handleCertificateUpload}
              multiple
            />
            <label htmlFor="certificateUpload" className="cursor-pointer">
              <CloudArrowDownIcon className="text-gray-700 mx-auto mb-2 h-8 w-8" />
              <p className="text-gray-700">
                Drag or{" "}
                <span className="cursor-pointer font-semibold text-sec-600">
                  upload
                </span>{" "}
                Certificate
              </p>
            </label>
          </div>

          {/* Display uploaded certificate and remove button */}
          {certificateFiles.map((file, index) => (
            <div
              key={index}
              className="bg-gray-100 mt-3 flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex items-center">
                <DocumentIcon className="text-gray-500 mr-2 h-6 w-6" />
                <p className="text-gray-700 truncate text-xl">{file.name}</p>
              </div>
              <button
                className="text-red-500 ml-4 font-semibold"
                onClick={() => removeCertificateFile(index)}
              >
                <XCircleIcon className="h-6 w-6 text-error-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentSection;
