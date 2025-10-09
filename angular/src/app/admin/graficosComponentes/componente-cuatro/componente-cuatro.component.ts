import { Component ,AfterViewInit} from '@angular/core';

import { VentaPorDistrito } from '../../../shared/dto/ventaPorDistrito.model';
import { VentaServiceService } from '../../service/venta-service.service';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title, RadarController } from 'chart.js';


@Component({
  selector: 'app-componente-cuatro',
  standalone:true,
  imports: [],
  templateUrl: './componente-cuatro.component.html',
  styleUrl: './componente-cuatro.component.css'
})
export class ComponenteCuatroComponent implements AfterViewInit{

  constructor(private ventaService: VentaServiceService) {

    Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title,RadarController);
  }


 ngAfterViewInit(): void {
    this.ventaService.listadoVentaPorDistrito().subscribe((data: VentaPorDistrito[]) => {
      const labels = data.map(d => d.distrito);
      const values = data.map(d => d.ventasTotales);

      const ctx = document.getElementById("radarChart") as HTMLCanvasElement;

      new Chart(ctx, {
        type: 'radar',
        data: {
          labels,
          datasets: [{
            label: 'Ventas por Distrito',
            data: values,
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Captación de Clientes por Distrito'
            }
          },
          scales: {
            r: {
              angleLines: { display: true },
              suggestedMin: 0
            }
          }
        }
      });
    });
  }
}
