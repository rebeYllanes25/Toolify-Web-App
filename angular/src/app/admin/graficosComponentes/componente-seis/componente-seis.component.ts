import { AfterViewInit, Component } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title, ChartConfiguration } from 'chart.js';
import { VentaServiceService } from '../../service/venta-service.service';


@Component({
  selector: 'app-componente-seis',
  imports: [],
  templateUrl: './componente-seis.component.html',
  styleUrl: './componente-seis.component.css'
})
export class ComponenteSeisComponent implements AfterViewInit{

  constructor(private ventaService: VentaServiceService) { }

ngAfterViewInit(): void {
  this.ventaService.listadoRMVentaYPedidos().subscribe((data: any[]) => {
    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title);

    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const dataVentas: number[] = [];
    const dataPedidos: number[] = [];

    meses.forEach((mes) => {
      const registro = data.find(d => d.mes.toLowerCase() === mes.toLowerCase());
      dataVentas.push(registro ? registro.totalVentas : 0);
      dataPedidos.push(registro ? registro.totalPedidos : 0);
    });

    const totalDuration = 3000;
    const delayBetweenPoints = totalDuration / meses.length;

    const animation: any = {
      x: {
        type: 'number',
        easing: 'linear',
        duration: (ctx: any) => delayBetweenPoints,
        from: NaN,
        delay: (ctx: any) => ctx.index * delayBetweenPoints
      },
      y: {
        type: 'number',
        easing: 'easeOutBounce',
        duration: (ctx: any) => delayBetweenPoints,
        from: (ctx: any) => ctx.index === 0
          ? ctx.chart.scales.y.getPixelForValue(0)
          : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y,
        delay: (ctx: any) => ctx.index * delayBetweenPoints
      }
    };

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Ventas',
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: '#8B5CF6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 7,
            tension: 0.4,
            fill: true,
            data: dataVentas,
          },
          {
            label: 'Pedidos',
            borderColor: '#FCD34D',
            backgroundColor: 'rgba(252, 211, 77, 0.1)',
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: '#FCD34D',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 7,
            tension: 0.4,
            fill: true,
            data: dataPedidos,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: animation,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              padding: 15,
              font: { size: 12, weight: 'bold' },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          title: {
            display: true,
            text: 'Ventas y Pedidos por Mes (2025)',
            font: { size: 16, weight: 'bold' },
            padding: { bottom: 20 },
            color: '#333'
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 11 },
            borderColor: '#ddd',
            borderWidth: 1,
            displayColors: true,
            callbacks: {
              label: (context: any) => `${context.dataset.label}: ${context.parsed.y}`
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Mes',
              font: { size: 12, weight: 'bold' },
              color: '#666'
            },
            grid: {
              display: false
            },
            ticks: {
              font: { size: 11 },
              color: '#666'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cantidad',
              font: { size: 12, weight: 'bold' },
              color: '#666'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: { size: 11 },
              color: '#666',
              callback: (value: any) => value.toLocaleString()
            }
          }
        }
      }
    };

    new Chart(document.getElementById('lineChart') as HTMLCanvasElement, config);
  });
}

}
