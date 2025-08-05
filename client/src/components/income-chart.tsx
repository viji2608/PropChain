import { useEffect, useRef } from "react";
import { Property } from "@shared/schema";

interface IncomeChartProps {
  properties: Property[];
}

export function IncomeChart({ properties }: IncomeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || properties.length === 0) return;

    const loadChart = async () => {
      // Dynamically import Chart.js to avoid SSR issues
      const { Chart, ArcElement, Tooltip, Legend, PieController } = await import("chart.js");
      Chart.register(ArcElement, Tooltip, Legend, PieController);

      const ctx = canvasRef.current!.getContext("2d");
      
      // Destroy existing chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      
      chartRef.current = new Chart(ctx!, {
        type: "pie",
        data: {
          labels: properties.map(p => p.name),
          datasets: [{
            data: properties.map(p => p.monthlyIncome),
            backgroundColor: [
              "hsl(259, 100%, 65%)",
              "hsl(158, 64%, 52%)",
              "hsl(45, 93%, 47%)",
              "hsl(0, 84%, 60%)",
              "hsl(263, 70%, 50%)",
            ],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                usePointStyle: true,
                padding: 20,
              }
            }
          }
        }
      });
    };

    loadChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [properties]);

  return (
    <div className="h-64">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
