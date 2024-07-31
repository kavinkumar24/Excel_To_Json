import { Bar } from 'react-chartjs-2';

const MyComponent = ({ theme, barData, sectionsBarData, render }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // Other chart options...
  };

  return (
    <div className={`mt-8 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
      {render && (
        <div className='bg-white shadow-md w-full h-full md:w-[54%]'>
          <div className="mt-8">
            <h3 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-gray-50'}`}>Gender Distribution</h3>
            <div className="mt-4 h-[50vh]">
              {barData && <Bar data={barData} options={chartOptions} />}
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-gray-50'}`}>Sections Distribution</h3>
            <div className="mt-4 h-[50vh]">
              {sectionsBarData && <Bar data={sectionsBarData} options={chartOptions} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComponent;
