import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);



function EmiChart(props) {
  const data = {
    labels: ['Principle Amount', 'Interest Payable'],
    datasets: [
      {
        label: '# of Votes',
        data: props.number,
        backgroundColor: [
          '#FF0000', // Red color
          '#FFFF00', // Yellow color
        ],
        legend: false,
        cutoutPercentage: 60,
        //   borderColor: [
        //     'rgba(255, 99, 132, 1)',
        //     'rgba(54, 162, 235, 1)',
        //     'rgba(255, 206, 86, 1)',
        //     'rgba(75, 192, 192, 1)',
        //     'rgba(153, 102, 255, 1)',
        //     'rgba(255, 159, 64, 1)',
        //   ],
        //   borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false
      }
    }
  };
  return (
    <div style={{ width: '200px', height: '200px' }}>
      <Doughnut data={data} options={options} />
    </div>
  )
}

export default EmiChart