import { Component, OnInit, Inject } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2'; // implementamos
import { DepartamentoService } from '../departamentos/departamento.service';
import { Departamento } from '../departamentos/departamento';
import { Ciudad } from '../ciudades/ciudad';
import { CiudadService } from '../ciudades/ciudad.service';
import { FormsModule, FormGroup, FormBuilder, Validators} from '@angular/forms';



// librerías relacionadas con ventanas modales
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientesComponent } from './clientes.component';
import { ɵBROWSER_SANITIZATION_PROVIDERS } from '@angular/platform-browser';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormClientesComponent implements OnInit {

  public listaDepartamentos: Departamento[];
  public cliente: Cliente = new Cliente();
  public departamentoseleccionado: Departamento;
  public listaCiudades: Ciudad[];
  public CiudadSelec: Ciudad;
  titulo: string = " Crear cliente";


  // constructor de la clase. Acá se instancian variables
  constructor(private clienteService: ClienteService,
              private departamentoService: DepartamentoService,
              private ciudadSrvice: CiudadService,
              private referenciaVentanaModal: MatDialogRef<FormClientesComponent>, // variable de referencia a la ventana modal
              @Inject(MAT_DIALOG_DATA) private idCliente: number,// Se inyecta un MAT_DIALOG_DATA idCliente al formulario
              private constructorFormulario: FormBuilder )
              { }


/*
    Al iniciar el componente se invocan los siguientes métodos:
      - cargarCliente(): carga el cliente por su id o carga un cliente vacío si no lo encuentra
      - getDept(): obtiene la lista de departamentos
*/
  ngOnInit() {
    this.cargarCliente();
   // this.departamentoseleccionado.id = 54;
   // this.departamentoseleccionado.nombre = "NORTE DE SANTANDER";
    this.getDept();
   }

    /*
        El método cancelarOperacion() cierra la ventana modal
    */
   cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }


/*
    Este método ejecuta el service que lista los departamentos 
    y asigna el listado de departamentos a la variable departamento:Departamento[]
      - Parámetros: ninguno
      - Retorna: nada
*/
 getDept(): void {
    this.departamentoService.obtenerDepartamentos().subscribe(dpto => {
      this.listaDepartamentos = dpto; //  Actualiza listado
    },
    error => {
      console.log('Error al listar los usuarios desde el servidor');
    }
  );
}


/*
  Este método asigna a la variable de clase CiudadSelecc el objeto de la ciudad seleccionada, 
  en el formulario
*/
 asignarCiudadSeleccionada(CiudadSelecc): void {
   this.cliente.ciudad = this.CiudadSelec;
 }
/*
  Este método obtiene las ciudades pertenecientes al departamento seleccionado
  y asigna el nombre del departamente a la variable departamento:String de la case Cliente
    - Parámetros: El departamento seleccionado
    - Retorna: nada
*/
 cargarCiudadDeptId(departamentoseleccionado): void {
    this.ciudadSrvice.obtenerCiudadId(departamentoseleccionado.id).subscribe(ciud => {
      this.listaCiudades = ciud;
    });
  }

  compararDepartamentos( a1: Departamento, a2: Departamento): boolean {
    if (a1 === undefined && a2 === undefined) { // a1, a2  identico undefined
      return true;
    }

    return ( a1 === null || a2 === null || a1 === undefined || a2 === undefined )
    ? false : a1.id === a2.id;
  }

  compararCiudades( c1: Ciudad, c2: Ciudad): boolean {

    return ( c1 === null || c2 === null || c1 === undefined || c2 === undefined )
    ? false : c1.id === c2.id;
  }

/*
  Este método revisa los parámetros de la URL y extrae el ID del cliente.
  Si el ID no es nulo ejecuta el service que obtiene el cliente por su ID
  - Parámetros: ninguno
  - Retorna: nada
*/
  cargarCliente(): void {

    if (this.idCliente) {
          this.clienteService.getCliente(this.idCliente).subscribe((cliente) => {
            this.cliente = cliente;
            this.CiudadSelec = new Ciudad(this.cliente.ciudad.id, this.cliente.ciudad.nombre, this.cliente.ciudad.departamento);
            this.departamentoseleccionado = new Departamento(this.cliente.ciudad.departamento.id, this.cliente.ciudad.departamento.nombre);
            this.cargarCiudadDeptId(this.cliente.ciudad.departamento);
            console.log("------------- departamento ---------------");
            console.log(this.departamentoseleccionado);
            console.log("------------- ciudad ---------------");
            console.log(this.CiudadSelec);

          });
        }
  }
}