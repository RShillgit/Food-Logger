import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import '../styles/pieChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);
  
const PieChart = (props) => {

    const data = {
        labels: ['Proteins', 'Carbs', 'Fats'],
        datasets: [
          {
            label: 'Grams',
            data: props.data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 2,
          },
        ]
    }

    return (
        <div className="pieChartContainer">
            <header className="title">
                <p>Macronutrients</p>
            </header>
            <Pie data={data} />
        </div>

    )
}

export default PieChart;