import { Component, AfterViewInit } from '@angular/core';

//chart.js
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title, ChartConfiguration } from 'chart.js';
import { VentaServiceService } from '../../service/venta-service.service';
import { VentaPorTipoVentaMesDTO } from '../../../shared/dto/ventaPorTipoVentaMesDTO.model';
@Component({
  selector: 'app-componente-cinco',
  imports: [],
  templateUrl: './componente-cinco.component.html',
  styleUrl: './componente-cinco.component.css'
})
export class ComponenteCincoComponent implements AfterViewInit {

  constructor(private ventaService: VentaServiceService) { }

  ngAfterViewInit(): void {
    this.ventaService.listadoVentaPorTipoVentaMes().subscribe((data) => {
      //registramos los charts para q la vista reconzca
      Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title);

      //definimos los meses a mostrar
      const meses = ["Enero", "Febrero", "Marzo",
        "Abril", "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"]

      //definimos el grafico XYZ
      const dataP: { x: number, y: number }[] = []
      const dataR: { x: number, y: number }[] = []

      meses.forEach((mes, i) => {
        const ventaP = data.find(d => d.mes === mes && d.tipoVenta === 'P')
        const ventaR = data.find(d => d.mes === mes && d.tipoVenta === 'R');

        dataP.push({ x: i, y: ventaP ? ventaP.cantidadVentas : 0 });
        dataR.push({ x: i, y: ventaR ? ventaR.cantidadVentas : 0 });
      })

      const totalDuration = 3000;
      const delayBetweenPoints = totalDuration / dataP.length;

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
      }

      const config: ChartConfiguration<'line', { x: number, y: number }[], string> = {
        type: 'line',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Ventas P',
              borderColor: 'red',
              borderWidth: 2,
              pointRadius: 3,
              data: dataP
            },
            {
              label: 'Ventas R',
              borderColor: 'blue',
              borderWidth: 2,
              pointRadius: 3,
              data: dataR
            }
          ]
        },
        options: {
          responsive: true,
          animation: animation,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Ventas por Mes y Tipo' }
          },
          scales: {
            x: {
              type: 'category',
              title: { display: true, text: 'Mes' }
            },
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Cantidad Ventas' }
            }
          }
        }
      };
        new Chart(document.getElementById('lineChart') as HTMLCanvasElement, config);
    });
  }
}
