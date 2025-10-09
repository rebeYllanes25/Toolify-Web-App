import { Component, OnInit, ViewChild } from '@angular/core';


//service
import { ProductoServiceService } from '../../service/producto-service.service';
import { CategoriaServiceService } from '../../service/categoria-service.service';
//formulario
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//entidad
import { Producto } from '../../../shared/model/producto.model';
//angular material

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Categoria } from '../../../shared/model/categoria.model';

@Component({
  selector: 'app-reporte-stock',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './reporte-stock.component.html',
  styleUrls: ['./reporte-stock.component.css']
})
export class ReporteStockComponent implements OnInit {

  dataSource = new MatTableDataSource<Producto>([]);
  columnas: string[] = ['idProducto', 'nombre', 'descripcion', 'proveedor', 'categoria', 'precio', 'stock', 'fechaRegistrado'];

  //definimos la lista categoria
  categoria: Categoria[] = []
  categoriaSeleccionada!: number | null
  orden: string = "ASC" //por defecto ascendente

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productoService: ProductoServiceService,
    private categoriaService: CategoriaServiceService
  ) { }

  ngOnInit(): void {

    this.cargarCategoria();
    this.filtrarProductos();
  }

  cargarCategoria(): void {
    this.categoriaService.listaCategorias().subscribe({
      next: (data) => {
        this.categoria = data
        console.log("categorias cargadas: ", data)
      },
      error: (err) => {
        console.log("Error: ", err)
      }
    })
  }

  onChangeCategoria(cateSelect:number|null):void{
    this.categoriaSeleccionada = cateSelect;
    console.log("Seleccionando: " ,cateSelect );
    this.filtrarProductos();
  }

  onChangeOrden():void{
    console.log("Seleccionando Orden: ", this.orden)
    this.filtrarProductos();
  }


  filtrarProductos(): void {
    const categoriaId = this.categoriaSeleccionada || 0;
    
    this.productoService.listarProductoPorCategoria(categoriaId,this.orden).subscribe({
      next : (data) =>{
        this.actualizarTabla(data);
         console.log("Filtrando por categoria", categoriaId, " orden: " ,this.orden)
      },
      error: (err) => console.error('Error obteniendo productos', err)
    })
    }

  actualizarTabla(productos: Producto[]): void {
    this.dataSource = new MatTableDataSource(productos);
    this.dataSource.paginator = this.paginator;
  }



  async generarPDF(): Promise<void> {
    try {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      
      const pdfMake = pdfMakeModule.default;
      
      if (pdfMake.vfs === undefined) {
        pdfMake.vfs = pdfFontsModule.default.vfs;
      }

      const tableHeaders = [
        { text: 'ID', style: 'tableHeader' },
        { text: 'Nombre', style: 'tableHeader' },
        { text: 'Descripción', style: 'tableHeader' },
        { text: 'Proveedor', style: 'tableHeader' },
        { text: 'Categoría', style: 'tableHeader' },
        { text: 'Precio (S/.)', style: 'tableHeader' },
        { text: 'Stock', style: 'tableHeader' },
        { text: 'Fecha Registro', style: 'tableHeader' }
      ];

      const tableBody = [tableHeaders];
      
      this.dataSource.data.forEach((p, index) => {
        const rowStyle = index % 2 === 0 ? 'tableRowEven' : 'tableRowOdd';
        tableBody.push([
          { text: (p.idProducto!).toString(), style: rowStyle },
          { text: p.nombre, style: rowStyle },
          { text: p.descripcion, style: rowStyle },
          { text: p.proveedor.razonSocial ?? "N/A", style: rowStyle },
          { text: p.categoria.descripcion, style: rowStyle },
          { text: `S/. ${(p.precio!).toFixed(2)}`, style: 'priceCell' },
          { 
            text: (p.stock!).toString(), 
            style: p.stock! <= 10 ? 'stockBajo' : 'stockNormal'
          },
          { 
            text: p.fechaRegistro ? new Date(p.fechaRegistro).toLocaleDateString('es-PE') : 'N/A', 
            style: rowStyle 
          }
        ]);
      });

      const totalProductos = this.dataSource.data.length;
      const stockBajo = this.dataSource.data.filter(p => p.stock! <= 10).length;
      const valorTotalInventario = this.dataSource.data.reduce((total, p) => total + (p.precio! * p.stock!), 0);

   

      const content: any[] = [
        {
          columns: [
            {
              width: '33%',
              stack: [
                { text: 'Total de Productos', style: 'statLabel' },
                { text: totalProductos.toString(), style: 'statValue' }
              ]
            },
            {
              width: '33%',
              stack: [
                { text: 'Stock Bajo (≤10)', style: 'statLabel' },
                { text: stockBajo.toString(), style: stockBajo > 0 ? 'statValueWarning' : 'statValue' }
              ]
            },
            {
              width: '34%',
              stack: [
                { text: 'Valor Total Inventario', style: 'statLabel' },
                { text: `S/. ${valorTotalInventario.toFixed(2)}`, style: 'statValue' }
              ]
            }
          ],
          margin: [0, 0, 0, 25]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', 'auto', 'auto', 'auto', 'auto'],
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
                    text: 'Sistema de Gestión de Inventarios', 
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

      const fileName = `reporte-stock-${new Date().toISOString().split('T')[0]}.pdf`;
      pdfMake.createPdf(docDefinition).download(fileName);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  }
}
