import axios from 'axios';
import { io } from 'socket.io-client';
import './index.css'

import FileUploader from './components/FileUploader'
import { useEffect, useState } from 'react';
import LineChart from './components/LineChart';
import ClassesReport from './components/ClassesReport';
interface IClassData {
  date: string;
  count: number;
}
interface IRegistrationRes {
  row: {
    'Registration ID': string;
    'Student ID': string;
    'Instructor ID': string;
    'Class ID': string;
    'Class Start Time': string;
    'Action': string;
  };
  message: string;
  status: string;
}

const App = () => {

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [classData, setClassData] = useState<IClassData[]>([]);
  const [registrationRes, setRegistrationRes] = useState<IRegistrationRes[]>([]);
  const [loading, setLoading] = useState(false);
  const socket: any = io(`http://localhost:3000`);

  useEffect(() => {
    socket.on('record_upload_status', (data: IRegistrationRes) => {
      setRegistrationRes((prevRegs: any[]) => [...prevRegs, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);



  useEffect(() => {
    const fetchClassDaywiseData = async () => {
      try {
        // Day wise scheduled classes data
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}daywise-classes`);
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
      formData.append('socketId', socket?.id);
    });
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}registration`, formData, {
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
                  <th className="border border-gray-300 px-4 py-2">Upload Status</th>
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
                    <td className="border border-gray-300 px-4 py-2">{res.status}</td>
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
