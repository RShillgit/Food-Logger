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
              'rgba(20, 255, 236, 0.4)',
              'rgba(22, 255, 0, 0.4)',
              'rgba(254, 231, 21, 0.4)',
            ],
            borderColor: [
              'rgba(20, 255, 236)',
              'rgba(22, 255, 0, 1)',
              'rgba(254, 231, 21, 1)',
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
            <div className='pieChart'>
                <Pie data={data} />
            </div>
        </div>

    )
}

export default PieChart;