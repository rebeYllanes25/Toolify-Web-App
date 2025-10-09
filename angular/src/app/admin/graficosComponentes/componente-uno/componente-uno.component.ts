import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale,ChartConfiguration  } from 'chart.js';


import { VentaServiceService } from '../../service/venta-service.service';
import { VentaPorFechasDTO } from '../../../shared/dto/VentaPorFechasDTO.model';


@Component({
  selector: 'app-componente-uno',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './componente-uno.component.html',
  styleUrl: './componente-uno.component.css'
})
export class ComponenteUnoComponent implements AfterViewInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  constructor(private ventaService: VentaServiceService) { }

  ngAfterViewInit(): void {
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);


    // Llamada al backend
    this.ventaService.listadoDeVentasPorMes().subscribe((data: VentaPorFechasDTO[]) => {
      const labels = data.map(d => d.mes);   
      const ventas = data.map(d => d.ventasTotales);   

      const chartData = {
        labels: labels,
        datasets: [{
          label: 'Ventas',
          data: ventas,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };

      const config:ChartConfiguration <'line',number[],string> = {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          animation:{
              duration: 3500,   
               easing: 'easeInOutCubic',
                 delay: 0, 
          },
          plugins: {
            title: { display: true, text: 'Ventas Del 2025' }
          }
        }
      };

      new Chart(
        document.getElementById('myChart') as HTMLCanvasElement,
        config
      );
    });

  }

}
