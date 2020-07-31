import { Component, OnInit, Inject } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2'; // implementamos
import { DepartamentoService } from '../departamentos/departamento.service';
import { Departamento } from '../departamentos/departamento';
import { Ciudad } from '../ciudades/ciudad';
import { CiudadService } from '../ciudades/ciudad.service';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';



// librerías relacionadas con ventanas modales
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientesComponent } from './clientes.component';
import { ɵBROWSER_SANITIZATION_PROVIDERS } from '@angular/platform-browser';
import { element } from 'protractor';



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
  titulo: string = "Crear cliente";
  public camposformulario: FormGroup; // Grupo de formulario

  // constructor de la clase. Acá se instancian variables
  constructor(private clienteService: ClienteService,
              private departamentoService: DepartamentoService,
              private ciudadSrvice: CiudadService,
              private referenciaVentanaModal: MatDialogRef<FormClientesComponent>, // variable de referencia a la ventana modal
              @Inject(MAT_DIALOG_DATA) private idCliente: number, // Se inyecta un MAT_DIALOG_DATA idCliente al formulario
              private constructorFormulario: FormBuilder ) { }


/*
    Al iniciar el componente se invocan los siguientes métodos:
      - cargarCliente(): carga el cliente por su id o carga un cliente vacío si no lo encuentra
      - getDept(): obtiene la lista de departamentos
*/
  ngOnInit() {
    this.CrearFormulario();
    this.cargarCliente();
   // this.departamentoseleccionado.id = 54;
   // this.departamentoseleccionado.nombre = "NORTE DE SANTANDER";
    this.getDept();
   }

   CrearFormulario(): void {
     this.camposformulario = this.constructorFormulario.group(
       {
         documento: ['', Validators.required],
         nombres: ['', Validators.required],
         apellidos: ['', Validators.required],
         numero_contacto: ['', Validators.required],
         departamento: ['', Validators.required],
         ciudad: ['', Validators.required],
         direccion: ['', Validators.required],
         correo: [''],
         codigo_postal: ['']
      }
     );
   }

   editardocumento() {
     return this.camposformulario.get('documento').setValue(this.cliente.documento);
   }

   get documentoNoValido() {
     return this.camposformulario.get('documento').invalid &&
     this.camposformulario.get('documento').touched;
   }
   get nombresNoValido() {
     return this.camposformulario.get('nombres').invalid &&
     this.camposformulario.get('nombres').touched;
   }
   get apellidosNovalidos() {
     return this.camposformulario.get('apellidos').invalid &&
     this.camposformulario.get('apellidos').touched;
   }
   get celNoValido() {
     return this.camposformulario.get('numero_contacto').invalid &&
     this.camposformulario.get('numero_contacto').touched;
   }
   get ciudadNoValido() {
     return this.camposformulario.get('ciudad').invalid &&
     this.camposformulario.get('ciudad').touched;
   }

   enviarFormulario() {
    if (this.camposformulario.invalid) {
      return this.camposformulario.markAllAsTouched();
    } else {
      this.referenciaVentanaModal.close(this.camposformulario.value);
    }
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
 asignarCiudadSeleccionada(evento): void {
  // console.log(evento.value);
  this.camposformulario.patchValue({
    id: evento.value.id,
    nombre: evento.value.nombre,
    departamento :
      {
        id: evento.value.departamento.id,
        nombre: evento.value.departamento.nombre
      }
  });
 }

/*
  Este método obtiene las ciudades pertenecientes al departamento seleccionado
  y asigna el nombre del departamente a la variable departamento:String de la case Cliente
    - Parámetros: El departamento seleccionado
    - Retorna: nada
*/
 cargarCiudadDeptId(evento): void {
   // console.log(evento.value.id);
   // console.log(evento.value);
   this.ciudadSrvice.obtenerCiudadId(evento.value.id).subscribe(ciud => {
   const FiltroListaCiudades = [];
   ciud.forEach(elemento =>{
     FiltroListaCiudades.push(
       {
         "id": elemento.id,
         "nombre": elemento.nombre,
         "departamento" :
           {
             "id": elemento.departamento.id,
             "nombre": elemento.departamento.nombre
           }
       }
     );
   });
   this.listaCiudades = FiltroListaCiudades;
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

    if (c1 === undefined && c2 === undefined) { // a1, a2  identico undefined
      return true;
    }

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
            this.cargarCiudadDeptIdporDefecto(this.cliente.ciudad.departamento);
            this.camposformulario.setValue({
              documento: this.cliente.documento,
              nombres: this.cliente.nombres,
              apellidos: this.cliente.apellidos,
              numero_contacto: this.cliente.numero_contacto,
              correo: this.cliente.correo,
              departamento: this.cliente.ciudad.departamento,
              ciudad: this.cliente.ciudad,
              direccion: this.cliente.direccion,
              codigo_postal: this.cliente.codigo_postal
            });
            });
        }
  }

  cargarCiudadDeptIdporDefecto(departamento: Departamento): void {
   this.ciudadSrvice.obtenerCiudadId(departamento.id).subscribe(ciud => {
   const FiltroListaCiudades = [];
   ciud.forEach(elemento =>{
     FiltroListaCiudades.push(
       {
         "id": elemento.id,
         "nombre": elemento.nombre,
         "departamento" :
           {
             "id": elemento.departamento.id,
             "nombre": elemento.departamento.nombre
           }
       }
     );
   });
   this.listaCiudades = FiltroListaCiudades;
   console.log(this.listaCiudades);
   });
  }

}
