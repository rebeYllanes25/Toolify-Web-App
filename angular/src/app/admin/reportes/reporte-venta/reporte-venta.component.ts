import { Component, OnInit, ViewChild } from '@angular/core';

//service 
import { VentaServiceService } from '../../service/venta-service.service';
//formulario
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//entidad
import { VentaFiltroFechaTipoUsuario } from '../../../shared/dto/VentaFiltroFechaTipoUsuario.model';
//angular material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-reporte-venta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './reporte-venta.component.html',
  styleUrl: './reporte-venta.component.css'
})
export class ReporteVentaComponent implements OnInit {

  dataSource = new MatTableDataSource<VentaFiltroFechaTipoUsuario>([]);
  columnas: string[] = ['idVenta', 'nombresCompletos', 'direccionUser', 'total', 'estado', 'tipoVenta', 'fecha'];


  fechaInicio: string | null= "";
  fechaFin: string | null = "";
  tipoVenta: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private ventaService: VentaServiceService,
  ) { }


  ngOnInit(): void {
    this.filtrarProductos();
  }

  onChangeFechas(): void {
    console.log("-----FECHAS RECIBIDAS DE LA VISTA------")
    console.log("Fecha inicio: ", this.fechaInicio, " fecha fin: ", this.fechaFin)
    if (this.fechaInicio && this.fechaFin) {
      this.filtrarProductos();
    }
  }

  onChangeTipoVenta(): void {
    console.log("Tipo de venta seleccionado", this.tipoVenta)
    this.filtrarProductos();
  }



  filtrarProductos(): void {
    console.log("FILTRANDO POR FECHA: ", this.fechaInicio, "&", this.fechaFin, "VENTA SELECCIONADA", this.tipoVenta)
   
    
    this.ventaService
      .ListadoVentaFechaAndTipoVenta
      (this.fechaInicio,
       this.fechaFin,
      this.tipoVenta??"").subscribe({
         next : (data) =>{
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
         },
         error  :(err) =>{
          console.log("ERROR PAPI NO SE PUEDE P: ", err)
         }  
        })
  }


  
async generarPDF(): Promise<void> {
    try {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      
      const pdfMake = pdfMakeModule.default;
      
      if (pdfMake.vfs === undefined) {
        pdfMake.vfs = pdfFontsModule.default.vfs;
      }
   const convertirEstado = (estado: string): string => {
      switch(estado) {
        case "G":
          return "Generado";
        case "P":
          return "Pendiente";
        case "C":
          return "Cancelado";
        case "E":
          return "En camino";
        case "F":
          return "Finalizado";
        default: 
          return "Sin estado";  
      }
    };

      const tableHeaders = [
        { text: 'ID', style: 'tableHeader' },
        { text: 'Nombre', style: 'tableHeader' },
        { text: 'Direccion', style: 'tableHeader' },
        { text: 'Precio Total', style: 'tableHeader' },
        { text: 'Estado', style: 'tableHeader' },
        { text: 'Tipo Venta', style: 'tableHeader' },
        { text: 'Fecha Generado', style: 'tableHeader' },
      ];

      const tableBody = [tableHeaders];
      
      this.dataSource.data.forEach((v, index) => {
        const rowStyle = index % 2 === 0 ? 'tableRowEven' : 'tableRowOdd';

      const idVenta = v.idVenta ? v.idVenta.toString() : 'N/A';
      const total = v.total != null ? v.total : 0; 
      const estado = convertirEstado(v.estado || ''); 
      const tipoVenta = v.tipoVenta === "P" ? "Presencial" : "Remota";
      const fecha = v.fecha ? new Date(v.fecha).toLocaleDateString('es-PE') : 'N/A';

        tableBody.push([
          { text: idVenta, style: rowStyle },
          { text: v.nombresCompletos, style: rowStyle },
          { text: v.direccionUser, style: rowStyle },
          { text: `S/. ${total.toFixed(2)}`, style: 'priceCell' },
          { text: estado, style: rowStyle },
          { text: tipoVenta , style: rowStyle },
          { 
            text: fecha,  style: rowStyle 
          }
        ]);
      });
      const content: any[] = [
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', 'auto', 'auto', 'auto',],
            body: tableBody
          },
          layout: {
            fillColor: function(rowIndex: number) {
              if (rowIndex === 0) return '#3498db';
              return rowIndex % 2 === 0 ? '#f8f9fa' : null;
            },
            hLineWidth: function() { return 0.5; },
            vLineWidth: function() { return 0.5; },
            hLineColor: function() { return '#dee2e6'; },
            vLineColor: function() { return '#dee2e6'; }
          }
        },
      ];

      const docDefinition: any = {
        pageSize: 'A4',
        pageMargins: [40, 80, 40, 60],
        
        header: {
          margin: [40, 20, 40, 20],
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                { 
                  text: 'REPORTE DE INVENTARIO', 
                  style: 'companyName',
                  border: [false, false, false, false]
                },
                { 
                  text: `Fecha: ${new Date().toLocaleDateString('es-PE')}\nHora: ${new Date().toLocaleTimeString('es-PE')}`, 
                  style: 'dateHeader',
                  border: [false, false, false, false]
                }
              ]
            ]
          }
        },

        footer: function(currentPage: number, pageCount: number) {
          return {
            margin: [40, 10],
            table: {
              widths: ['*', 'auto'],
              body: [
                [
                  { 
                    text: 'Reporte de Ventas', 
                    style: 'footer',
                    border: [false, false, false, false]
                  },
                  { 
                    text: `Página ${currentPage} de ${pageCount}`, 
                    style: 'footer',
                    border: [false, false, false, false]
                  }
                ]
              ]
            }
          };
        },

        content: content,

        styles: {
          companyName: {
            fontSize: 18,
            bold: true,
            color: '#2c3e50'
          },
          dateHeader: {
            fontSize: 9,
            color: '#7f8c8d'
          },
          sectionHeader: {
            fontSize: 14,
            bold: true,
            color: '#2c3e50',
            decoration: 'underline'
          },
          statLabel: {
            fontSize: 10,
            color: '#7f8c8d',
            margin: [0, 0, 0, 5]
          },
          statValue: {
            fontSize: 16,
            bold: true,
            color: '#27ae60'
          },
          statValueWarning: {
            fontSize: 16,
            bold: true,
            color: '#e74c3c'
          },
          filterInfo: {
            fontSize: 10,
            italics: true,
            color: '#7f8c8d'
          },
          tableHeader: {
            fontSize: 10,
            bold: true,
            color: 'white'
          },
          tableRowEven: {
            fontSize: 9,
            color: '#2c3e50'
          },
          tableRowOdd: {
            fontSize: 9,
            color: '#2c3e50'
          },
          priceCell: {
            fontSize: 9,
            color: '#2c3e50',
            bold: true
          },
          stockNormal: {
            fontSize: 9,
            color: '#2c3e50',
            bold: true
          },
          stockBajo: {
            fontSize: 9,
            bold: true,
            color: '#e74c3c'
          },
          observations: {
            fontSize: 10,
            color: '#34495e'
          },
          footer: {
            fontSize: 8,
            color: '#95a5a6'
          }
        },

        defaultStyle: {
          font: 'Roboto'
        }
      };

      const fileName = `reporte-ventas-${new Date().toISOString().split('T')[0]}.pdf`;
      pdfMake.createPdf(docDefinition).download(fileName);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  }

}
