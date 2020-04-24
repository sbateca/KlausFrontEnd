import { Component, OnInit, ViewChild } from '@angular/core';
import { Proveedor } from './proveedor';
import { ProveedorService } from './proveedor.service';
import alertasSweet from 'sweetalert2';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
// import {MatSort} from '@angular/material/sort';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})




export class ProveedoresComponent implements OnInit {


  // listado de Proveedores
  proveedores: Proveedor[];
  titulo: string = 'Proveedores';
  rutaFuncionalidades: string = 'Proveedores / Listar proveedores';

  // se declara una variable de tipo ProveedorService (debe ser privada)
  private proveedorService: ProveedorService;

 

  // instanciamos el ProveedorService
  constructor(proveedorService: ProveedorService) {
      this.proveedorService = proveedorService;
   }



  // variables con valores iniciales para el paginador
  totalRegistros = 0;
  tamanoPagina = 5;
  paginaActual = 0;
  elementosPorPagina: number[] = [5, 10, 20, 30, 50, 100];

  columnasTabla: string[] = ['nombres', 'apellidos', 'documento', 'acciones']; // contiene los ID de cada una de las columnas de la tabla
  datos: MatTableDataSource<Proveedor>;
  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
  // @ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;





  /*
    Al inicializar el componente se mostrará el listado de proveedores paginado,
    es por ello que  en esta parte se ejecutan dichas acciones
  */
  ngOnInit(): void {
    this.listaPaginado();
  }






/*
  El método paginar() realiza el control de la paginación.
  Cada vez que se seleccione un botón del paginador se actualizan los valores de las variables y se realiza el get con los parámetros
  Parámetros:
      - evento: PageEvent --> el evento de tipo PageEvent
  Retorna: nada
*/
paginar(evento: PageEvent): void {
  this.paginaActual = evento.pageIndex;
  this.tamanoPagina = evento.pageSize;
  this.totalRegistros = evento.length;

  this.listaPaginado();
}





/*
    El método listaPaginado() realiza el get de acuerdo a los valores actualizados
*/

  private listaPaginado(): void {
    this.proveedorService.listarProveedoresPaginado(this.paginaActual.toString(), this.tamanoPagina.toString()).subscribe(
      paginadorProveedor => {

        // se extrae el contenido del JSON paginador
          this.proveedores = paginadorProveedor.content as Proveedor[]; // Arreglo de Proveedor
          this.totalRegistros = paginadorProveedor.totalElements as number; // cantidad de registros
        
          // se organiza la información en un MatTableDataSource para usar los componentes de Angular Material
          this.datos = new MatTableDataSource<Proveedor>(this.proveedores);
          this.datos.paginator = this.paginador;

          // asigna el sorting al MatTableDataSource
         // this.datos.sort = this.ordenadorRegistros;
      }
  );
  }






/*
  El método aplicarFiltro permite realizar proceso de filtrado de datos
  Parámetros:
      - El evento generado
      - Retorna: nada
*/

aplicarFiltro(event: Event) {
  const textoFiltro = (event.target as HTMLInputElement).value;
  this.datos.filter = textoFiltro.trim().toLowerCase();
}



  /*
    El método eliminarProveedor(Proveedor) ejecuta el método eliminarProveedor del ClienteService.
      Parámetros: El proveedor a eliminar
      Retorna: nada
  */
  eliminarProveedor(proveedor: Proveedor){

   this.proveedorService.eliminarProveedor(proveedor.id).subscribe(
     respuesta => {
       //this.proveedores = this.proveedores.filter( prov => prov !== proveedor)
       this.listaPaginado(); // cada vez que se elimine se lista paginado (refresca los valores y la lista)
     }
   )
  }


}
