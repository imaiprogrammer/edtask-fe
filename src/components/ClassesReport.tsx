import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Instructor {
  instructorId: string;
  name: string;
  email: string;
}

const ClassesReport: React.FC = () => {
  const [registeredData, setRegisteredData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instructorsResponse = await axios.get(`${import.meta.env.VITE_BASE_API_URL}instructors`);
        const registerationResponse = await axios.get(`${import.meta.env.VITE_BASE_API_URL}registrations-list`);
        setRegisteredData(registerationResponse.data);
        setInstructors(instructorsResponse.data);
        setFilteredData(registerationResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const handleFilter = () => {
    let filtered = registeredData;
    if (selectedDate) {
      filtered = filtered.filter((item) =>
        new Date(item.startTime).toISOString().split('T')[0] === selectedDate
      );
    }
    if (selectedInstructor) {
      filtered = filtered.filter(
        (item) => item.instructorInfo.name === selectedInstructor
      );
    }
    setFilteredData(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Classes Report</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Date Filter */}
        <div className="flex flex-col">
          <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">
            Filter by Date:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* Instructor Filter */}
        <div className="flex flex-col">
          <label htmlFor="instructor" className="block text-gray-700 font-semibold mb-2">
            Filter by Instructor:
          </label>
          <select
            id="instructor"
            value={selectedInstructor}
            onChange={(e) => setSelectedInstructor(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          >
            <option value="">All Instructors</option>
            {instructors.map((instructor) => (
              <option key={instructor.instructorId} value={instructor.name}>
                {instructor.name} - {instructor.email}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Button */}
        <div className="flex items-end">
          <button
            onClick={handleFilter}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Instructor</th>
            <th className="border px-4 py-2">Student</th>
            <th className="border px-4 py-2">Class ID</th>
            <th className="border px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((data, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  {new Date(data.startTime).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  {data.instructorInfo.name} ({data.instructorInfo.expertise})
                </td>
                <td className="border px-4 py-2">{data.studentId}</td>
                <td className="border px-4 py-2">{data.classInfo.className}</td>
                <td className="border px-4 py-2">{data.classInfo.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-4 py-2 text-center" colSpan={5}>
                No classes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClassesReport;
