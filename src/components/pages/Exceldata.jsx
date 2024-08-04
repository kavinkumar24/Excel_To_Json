import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { FaSun,FaMoon, FaArrowDown,FaArrowLeft,FaArrowRight,FaSearch} from 'react-icons/fa';

import { Chart as ChartJs, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar,Doughnut, Pie } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJs.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Exceldata = () => {
  const fileInput = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [fileName, setFileName] = useState('');
  const [summary, setSummary] = useState({});
  const[theme, setTheme] = useState(()=>{
    return localStorage.getItem('theme') || 'light';
  });
  const [render, setRender] = useState(false);
  const [barData, setBarData] = useState(null);
  const [gradesBarData, setGradesBarData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Grades',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });
  const [sectionsBarData, setSectionsBarData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Sections',
        data: [],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  });

  const [overallGender, setOverallGender] = useState({
      labels: ['Male', 'Female'],
      datasets: [{
        label: 'Gender Distribution',
        data: [0, 0],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
        ],
        hoverOffset: 4,
        
      }]
  });
  const[loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState([]);

 const[search,setSearch] = useState('')
  const handleNextPage = () => {
    if (currentPage < Math.ceil(data.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const currentData = data.slice((currentPage-1) * rowsPerPage,currentPage * rowsPerPage);


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color:  theme==='light'?'black':'white'
        },
        grid: {
          color: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
        },
      },
      y: {
        ticks: {
          color:  theme==='light'?'black':'white'
        },
        grid: {
          color: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color:  theme==='light'?'black':'white',
        },
      },
      title: {
        display: true,
        text: 'Chart Title',
        color:  theme==='light'?'black':'white',
        borderColor: theme==='light'?'white':'black'
      },
    },
  };
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState(false);

useEffect(() => {
  let filteredData = originalData;

  if (genderFilter) {
    filteredData = filteredData.filter(item => item.Gender === genderFilter);
  }

  if (ageFilter) {
    filteredData = filteredData.filter(item => item.Age > 13);
  }

  if (search) {
    filteredData = filteredData.filter(item => item.Name.toLowerCase().includes(search.toLowerCase()));
  }

  if (filteredData.length === 0) {
    setData(originalData);
  } else {
    setData(filteredData);
  }
}, [search, genderFilter, ageFilter, originalData]);

const handleGenderFilter = (gender) => {
  setGenderFilter(genderFilter === gender ? '' : gender);
};

const handleAgeFilter = () => {
  setAgeFilter(!ageFilter);
};

  useEffect(() => {
    if (data.length > 0) {
      
      const totalFields = data.length;
      const totalMales = data.filter((item) => item.Gender === 'Male').length;
      const totalFemales = data.filter((item) => item.Gender === 'Female').length;
      setSummary({ totalFields, totalMales, totalFemales });

      
      const labels = Object.keys(data[0]).filter(key => key !== 'Gender');
      const maleData = labels.map(label => data.filter(item => item.Gender === 'Male').reduce((acc, cur) => acc + parseInt(cur[label] || 0, 10), 0));
      const femaleData = labels.map(label => data.filter(item => item.Gender === 'Female').reduce((acc, cur) => acc + parseInt(cur[label] || 0, 10), 0));

      setBarData({
        labels,
        datasets: [
          {
            label: 'Male',
            data: maleData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Female',
            data: femaleData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      });

      
      const gradesData = ['A', 'B', 'C'].map((grade) => {
        return data.filter((item) => item.Grade === grade).length;
      });

      const genderData = ['Male','Female'].map((gender)=>{
        return data.filter((item)=>item.Gender===gender).length;
      })
      console.log(genderData)

      setGradesBarData({
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            label: 'Grades',
            data: gradesData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });

     

      
      
      const sectionsData = ['A', 'B', 'C'].map((section) => {
        return data.filter((item) => item.Section === section).length;
      });
      console.log(sectionsData)

      setSectionsBarData({
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            label: 'Sections',
            data: sectionsData,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'Green'
              
            ],
            borderColor: 'lightgray',
            borderWidth: 1,
          },
        ],
      });
     
   
      setOverallGender({
        labels: ['Male', 'Female'],
        datasets: [
          {
            data: [totalMales, totalFemales],
            backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
            borderColor: ['lightgray'],
            borderWidth: 1,
          },
        ],
      });
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
    if(file === undefined) {
      toast.error('Please select a file');
      return;
    }
    setLoading(true);

    setTimeout(()=>{
      setLoading(false);
    },2400)
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data);
      setOriginalData(response.data);
      setRender(true);
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
    setLoading(true);

    setTimeout(()=>{
      setLoading(false);
    },1000)
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
 
  const[search_spin, setSearch_spin] = useState(false);
  
  useEffect(() => {
    
    if (search === '') {
      setData(originalData);
    } else {
      const search_data = originalData.filter((item) =>
        item.Name.toLowerCase().includes(search.toLowerCase())
      );
      if (search_data.length === 0) {
        toast.error('No data found');
        setData(originalData);
      } else {
        setData(search_data);
      }
    }
  }, [search, originalData]);
  
  const handlesearch =() =>{
    
    const search_data = data.filter((item)=>item.Name.toLowerCase().includes(search.toLowerCase()));
    console.log(data[0])
    if(search_data.length === 0){
      toast.error('No data found');
        setData(originalData);
      }
      else{
      setData(search_data)
      }
  }
  const handlesearch_input = (e)=>{
    setSearch_spin(true);
    setTimeout(()=>{
      setSearch_spin(false);
    },500)
    setSearch(e.target.value);

  }
  

  
    
  return (
    <div className={`w-full min-h-screen ${theme==='light'? 'white':'bg-gray-700'}`}>
      
      
     <ToastContainer />
    <div className={`container mx-auto px-4 py-10`}>
    <div className="flex justify-end items-center space-x-4">
  <select
    className={`cursor-pointer w-22 h-10 px-3 py-2 text-base rounded-lg focus:ring-2 focus:ring-blue-400 ${theme === 'light' ? 'text-gray-700 border border-gray-300 focus:ring-offset-2 focus:outline-none shadow-xl' : 'bg-gray-600 text-gray-50 border-white shadow-xl'}`}
    value={theme}
    onChange={handleselect}
  >
    <option value="dark" className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900 text-white'}`}>Dark</option>
    <option value="light" className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900 text-white'}`}>Light</option>
  </select>
  <div className="flex items-center px-2 pointer-events-none">
    {theme === 'light' ? (
    <div className='bg-slate-100 p-2 rounded-md shadow-lg'>
    <FaSun className="text-yellow-500" /> 
    </div>
    )
    :
    (
    <div className='bg-gray-800 p-2 rounded-md shadow-lg'>
    <FaMoon className="text-blue-500" />
    </div>
    )
    
    
    }
  </div>
  
</div>

      <br></br>
      <h1 className={`text-3xl font-semibold text-center py-4 ${theme==='light'? 'text-gray-800':'text-gray-50'}`}>Convert your excel data</h1>
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
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:w-[80%] xl:w-[80%] justify-center items-center relative md:left-32 w-full">
            <div className={`p-4 rounded-lg shadow-lg ${theme==='light'?'bg-white border border-gray-200':'bg-slate-500 text-gray-50'}`}>
              <h2 className="text-lg font-semibold">Total Fields</h2>
              <p>{summary.totalFields}</p>
            </div>
            <div className={`p-4 rounded-lg shadow-lg ${theme==='light'?'bg-white border border-gray-200':'bg-slate-500 text-gray-50'}`}>
              <h2 className="text-lg font-semibold">Total Males</h2>
              <p>{summary.totalMales}</p>
            </div>
            <div className={`p-4 rounded-lg shadow-lg ${theme==='light'?'bg-white border border-gray-200':'bg-slate-500 text-gray-50'}`}>
              <h2 className="text-lg font-semibold">Total Females</h2>
              <p>{summary.totalFemales}</p>
            </div>
          
          </div>
          {render && (
        <div className='w-full h-full  grid grid-cols-1 md:grid-col-2 md:grid-cols-3  gap-9 '>
          <div className="mt-8">
            <h3 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-gray-50'}`}>Gender wise Distribution</h3>
            <div className={`mt-4 h-[50vh] w-[95%] ${theme==='light'? 'bg-white':'bg-gray-600 border-gray-400'} shadow-lg p-4 rounded-lg border border-gray-200`}>
              {barData && <Bar data={barData} options={chartOptions} />}
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-gray-50'}`}>Sections Distribution</h3>
            <div className={`mt-4 h-[50vh] w-[95%] ${theme==='light'? 'bg-white':'bg-gray-600 border-gray-400'} shadow-lg p-4 rounded-lg border border-gray-200`}>
              {sectionsBarData && <Bar data={sectionsBarData} options={chartOptions} />}
            </div>
          </div>

          <div className="mt-8">
            <h3 className={`text-xl font-semibold  ${theme === 'light' ? 'text-gray-800' : 'text-gray-50'}`}>Gender Distribution</h3>
            <div className={`mt-4 h-[50vh] w-[95%] ${theme==='light'? 'bg-white':'bg-gray-600 border-gray-400'} shadow-lg p-4 rounded-lg border border-gray-200`}>
              {overallGender && <Pie data={overallGender} options={chartOptions} />}
            </div>
          </div>

      
        </div>
      )}
      <br></br> 
      <div className='flex justify-center'>
      <input type='email'  className={`px-10 mt-10 border border-gray-300 p-2 w-full md:w-[50%] lg:w-[50%] xl:w-[50%] outline-none focus:ring-2 focus:ring-blue-200 rounded-tl-md rounded-bl-md shadow-md cursor-text ${theme==='light'?'bg-white':'bg-gray-800 border-gray-600 text-indigo-300'}`}name="search" placeholder="Search"  value={search} onChange={handlesearch_input} />
      <button className='mt-10 px-8 py-4 bg-indigo-500 text-white rounded-tr-md rounded-br-md w-20' onClick={handlesearch}>
      <FaSearch  />
      </button>
      </div>
      <div className="flex justify-center space-x-4 py-4">
        <button
          className={`px-4 py-2 rounded-md ${genderFilter === 'Male' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => handleGenderFilter('Male')}
        >
          Male
        </button>
        <button
          className={`px-4 py-2 rounded-md ${genderFilter === 'Female' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => handleGenderFilter('Female')}
        >
          Female
        </button>
        <button
          className={`px-4 py-2 rounded-md ${ageFilter ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={handleAgeFilter}
        >
          Above 13
        </button>
      </div>
          <div className="shadow-lg rounded-lg w-full flex justify-center pt-2 overflow-x-auto custom-scrollbar">
            <div className="block w-full">
          <table className={`min-w-full table-fixed bg-white border rounded-lg mt-4 ${theme === 'light' ? 'border-gray-200' : 'border-gray-500 text-white'}`}>
          <thead className={`bg-gray-500 ${theme === 'light' ? 'text-white' : 'text-gray-300'}`}>
      <tr>
        {Object.keys(data[0]).map((key) => (
          <th
            key={key}
            onClick={() => handleSort(key)}
            className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-nowrap"
            title="sorting"

          >
           <div className='text-nowrap flex'>{key}
            <div className='py-0.5 px-1'>
           <FaArrowDown  />
           </div>
           </div>
           
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {currentData.map((row, rowIndex) => (
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
              className={`px-0 py-4 whitespace-nowrap text-sm font-medium ${
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
<div className="flex justify-center items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed shadow-md "
        >
          <FaArrowLeft />
        </button>
        <span className={`p-4 ${theme==='light'?'text-gray-700':'text-gray-100'}`}>
          Page {currentPage} of {Math.ceil(data.length / rowsPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <FaArrowRight />
        </button>
      </div>

        </>
      )}
    </div>
    {loading && (
          <div class={`max-w-full max-h-full fixed px-96 2xl:pr-px inset-0 z-50 ${theme==='light'?'bg-white ':'bg-gray-800 max-w-full max-h-full fixed px-96 2xl:pr-px inset-0 z-50 '}`}>
          <div class="max-h-10 w-10 bg-indigo-500 items-center justify-center pt-10 relative top-72 -left-52 md:top-60 md:left-52 animate-bounce rounded-lg 2xl:left-[35%] lg:left-[50%] 2xl:top-80 
          3xl:left-96
          "></div>
          
        </div>
      )}
      {search_spin&&
      <div className={`max-w-full bg-opacity-35 max-h-full fixed px-96 2xl:pr-px inset-0 z-50 ${theme==='light'? 'bg-gray-500':'bg-black'}`}>
      <div className="flex gap-2 max-h-20 w-20 items-center justify-center relative top-72 -left-52 md:top-72 md:left-36 animate-bounce rounded-lg 2xl:left-[35%] lg:left-[45%] 2xl:top-80 
          3xl:left-96">
      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
      </div>
  </div>
      }
    </div>
  );
};

export default Exceldata;
