import axios from 'axios';
import './index.css'

import FileUploader from './components/FileUploader'
import { useEffect, useState } from 'react';
import LineChart from './components/LineChart';
import ClassesReport from './components/ClassesReport';
interface IClassData {
  date: string;
  count: number;
}

const App = () => {

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [classData, setClassData] = useState<IClassData[]>([]);

  const [registrationRes, setRegistrationRes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClassDaywiseData = async () => {
      try {
        // Day wise scheduled classes data
        const response = await axios.get('http://localhost:3000/daywise-classes');
        setClassData(response.data);
      } catch (error) {
        console.error('Error fetching class data:', error);
      }
    };
    fetchClassDaywiseData();
  }, []);

  const handleFileUpload = (acceptedFiles: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
  }

  const uploadFileToServer = async () => {
    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append('file', file);
    });
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/registration', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setRegistrationRes(response.data);
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='container mx-auto p-4 min-h-screen flex flex-col items-center'>
      <h1 className='text-4xl font-bold text-center'>Excellent Driving Center Assessment</h1>
      <div className="card bg-white shadow-lg rounded-lg p-6 m-6 w-full max-w-md">
        <FileUploader onUpload={handleFileUpload} maxFiles={1} uploadedFiles={uploadedFiles} />
      </div>
      <div>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={uploadFileToServer}>
          Upload File to Server
        </button>
      </div>

      {loading && (
        <div className="mt-4">
          <div>Uploading, please wait...</div>
        </div>
      )}
      
      <div>
        {registrationRes.length > 0 && (
          <div className="mt-8 w-full max-w-4xl">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Registration ID</th>
                  <th className="border border-gray-300 px-4 py-2">Student ID</th>
                  <th className="border border-gray-300 px-4 py-2">Instructor ID</th>
                  <th className="border border-gray-300 px-4 py-2">Class ID</th>
                  <th className="border border-gray-300 px-4 py-2">Start Time</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                  <th className="border border-gray-300 px-4 py-2">Message</th>
                </tr>
              </thead>
              <tbody>
                {registrationRes.map((res: any, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{res.row['Registration ID']}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.row['Student ID']}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.row['Instructor ID']}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.row['Class ID']}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.row['Class Start Time']}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.row['Action']}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      <LineChart data={classData} />

      <ClassesReport />

    </div>
  )
}

export default App
