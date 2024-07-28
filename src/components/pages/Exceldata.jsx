import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const Exceldata = () => {
  const fileInput = useRef(null);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [fileName, setFileName] = useState('');
  const [summary, setSummary] = useState({});
  const[theme, setTheme] = useState(()=>{
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (data.length > 0) {
      const totalFields = data.length;
      const totalMales = data.filter((item) => item.Gender === 'Male').length;
      const totalFemales = data.filter((item) => item.Gender === 'Female').length;
      setSummary({ totalFields, totalMales, totalFemales });
    }
  }, [data]);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const file = fileInput.current.files[0];
    console.log(file)
    const formData = new FormData();
    formData.append('file', file);
    

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data);
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleselect =(e) =>{
   setTheme(e.target.value)
  }
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setData(sortedData);
  };

  return (
    <div className={`w-full min-h-screen ${theme==='light'? 'bg-gray-100':'bg-gray-700'}`}>
    <div className={`container mx-auto px-4 py-10`}>
      <div>
        <select className={` cursor-pointer  w-20 h-10 px-3 py-2  text-base rounded-lg  focus:ring-2 focus:ring-blue-400 ${theme==='light'? 'text-gray-700 border border-gray-300 focus:ring-offset-2 focus:outline-none shadow-xl':'bg-gray-600 text-gray-50 border-white shadow-xl'}`} value={theme} onChange={handleselect}>
        <option value="dark" className={`${theme==='light'?'bg-gray-100':'bg-gray-900 text-white '}`}>Dark</option>
        <option value="light" className={`${theme==='light'?'bg-gray-100':'bg-gray-900 text-white'}`}>Light</option>
          </select>
      </div>
      <br></br>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-[50%] h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ${theme==='light'?'bg-gray-50 dark:hover:bg-gray-200 dark:bg-gray-100 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500':'bg-gray-600 border-gray-400 dark:hover:bg-gray-800'}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-6 h-6 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            {fileName ? (
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">File:</span> {fileName}
              </p>
            ) : (
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">xlsx</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" ref={fileInput} accept='xlsx' onChange={handleFileChange} />
        </label>
      </div>
      <button
        type="submit"
        className="ml-4 mt-3 px-4 py-2 font-bold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        onClick={handleFileUpload}
      >
        Upload
      </button>
            <br></br>
            <br></br>
      {data.length > 0 && (
        <>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className={`p-4 rounded-lg shadow-xl ${theme==='light'?'bg-white border border-gray-200':'bg-slate-500 text-gray-50'}`}>
              <h2 className="text-lg font-semibold">Total Fields</h2>
              <p>{summary.totalFields}</p>
            </div>
            <div className={`p-4 rounded-lg shadow-sm ${theme==='light'?'bg-white border border-gray-200':'bg-slate-500 text-gray-50'}`}>
              <h2 className="text-lg font-semibold">Total Males</h2>
              <p>{summary.totalMales}</p>
            </div>
            <div className={`p-4 rounded-lg shadow-sm ${theme==='light'?'bg-white border border-gray-200':'bg-slate-500 text-gray-50'}`}>
              <h2 className="text-lg font-semibold">Total Females</h2>
              <p>{summary.totalFemales}</p>
            </div>
          
          </div>
          <div className="shadow-lg rounded-lg w-full flex justify-center pt-2 overflow-x-auto">
            <div className="block w-full">
          <table className={`min-w-full table-fixed bg-white border rounded-lg mt-4 ${theme === 'light' ? 'border-gray-200' : 'border-gray-500 text-white'}`}>
          <thead className={`bg-gray-500 ${theme === 'light' ? 'text-white' : 'text-gray-300'}`}>
      <tr>
        {Object.keys(data[0]).map((key) => (
          <th
            key={key}
            onClick={() => handleSort(key)}
            className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
            title="sorting"
          >
            {key}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className={`${
            rowIndex % 2 === 0
              ? theme === 'light'
                ? 'bg-white'
                : 'bg-gray-600'
              : theme === 'light'
              ? 'bg-gray-200'
              : 'bg-gray-800 text-white'
          }`}
        >
          {Object.values(row).map((value, colIndex) => (
            <td
              key={colIndex}
              className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                theme === 'light' ? 'text-gray-900' : 'text-gray-300'
              }`}
            >
              {value}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
  </div>
</div>

        </>
      )}
    </div>
    </div>
  );
};

export default Exceldata;
