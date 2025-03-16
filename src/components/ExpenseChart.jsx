import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { motion } from 'framer-motion';

export const ExpenseChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: [
            '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'
          ],
          borderWidth: 0,
          hoverOffset: 20
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          tooltip: {
            bodyFont: { size: 16 },
            titleFont: { size: 18 },
            padding: 12
          }
        }
      }
    });
  }, [data]);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="relative w-full h-96"
    >
      <canvas ref={chartRef} />
      
      {/* Center Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-cyan-600">Total Expenses</p>
          <p className="text-4xl font-bold text-gray-800">${data.total}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseChart;