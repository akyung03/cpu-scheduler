// components/Chart.js
import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const ChartComponent = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: 'Burst Time',
              data: data.burstTimes,
              backgroundColor: 'rgba(89, 134, 134, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: 'Wait Time',
              data: data.waitTimes,
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;
