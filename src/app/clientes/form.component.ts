import { Component, OnInit, Inject } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { DepartamentoService } from '../departamentos/departamento.service';
import { Departamento } from '../departamentos/departamento';
import { Ciudad } from '../ciudades/ciudad';
import { CiudadService } from '../ciudades/ciudad.service';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

// librerías relacionadas con ventanas modales
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormClientesComponent implements OnInit {

  public listaDepartamentos: Departamento[];
  public cliente: Cliente = new Cliente();
  public listaCiudades: Ciudad[];
  titulo: string = "Crear cliente";
  public camposformulario: FormGroup; // Grupo de formulario

  // constructor de la clase. Acá se instancian variables
  constructor(private clienteService: ClienteService,
              private departamentoService: DepartamentoService,
              private ciudadSrvice: CiudadService,
              private referenciaVentanaModal: MatDialogRef<FormClientesComponent>, // variable de referencia a la ventana modal
              @Inject(MAT_DIALOG_DATA) private idCliente: number, // Se inyecta un MAT_DIALOG_DATA idCliente al formulario
              @Inject(MAT_DIALOG_DATA) private documento: number, // En documento se recibe un array de documento y un true desde pedido
              private constructorFormulario: FormBuilder ) { }


/*
    Al iniciar el componente se invocan los siguientes métodos:
      - cargarCliente(): carga el cliente por su id o carga un cliente vacío si no lo encuentra
      - getDept(): obtiene la lista de departamentos
*/
  ngOnInit() {
    this.CrearFormulario();
    this.CargaClienteProductoCliente();
   // this.departamentoseleccionado.id = 54;
   // this.departamentoseleccionado.nombre = "NORTE DE SANTANDER";
    this.getDept();

    
   }

   // Cargar cliente desdes Producto o desde Cliente
  CargaClienteProductoCliente() {
    
    // Documento no es null cuando se crea el cliente desde Pedido
    if(this.documento!=null){
      // El array documento en la posicion 0 cuando viene de FormPedido
      if(this.documento[1] == true){
        // Carga el numero de documento(documento[0]) en el Form 
        this.camposformulario.get('documento').setValue(this.documento[0]);
      } else {
        // Sino es por que lo que se carga es el cliente
        this.cargarCliente();
      } 
    }
    
  }

   CrearFormulario(): void {
     this.camposformulario = this.constructorFormulario.group(
       {
         documento:  ['', [/* Validators.required,  */Validators.minLength(6), Validators.maxLength(10)]],
         nombres: ['', Validators.required],
         apellidos: ['', Validators.required],
         numero_contacto: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
         fijo: ['', [/* Validators.required, */ Validators.minLength(4), Validators.maxLength(10)]],
         departamento: ['', Validators.required],
         ciudad: ['', Validators.required],
         direccion: ['', Validators.required]
         // correo: [''/*,  Validators.email */],
         // codigo_postal: ['', [Validators.minLength(6), Validators.maxLength(6)]]
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

  
  // El método cancelarOperacion() cierra la ventana modal

  cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }


  /*  Este método ejecuta el service que lista los departamentos
      y asigna el listado de departamentos a la variable departamento:Departamento[]
      - Parámetros: ninguno
      - Retorna: nada */
  getDept(): void {
    this.departamentoService.obtenerDepartamentos().subscribe(dpto => {
      this.listaDepartamentos = dpto; //  Actualiza listado
    },error => {
        console.log('Error al listar los usuarios desde el servidor');
      });
  }


  /* Este método obtiene las ciudades pertenecientes al departamento seleccionado
     y asigna el nombre del departamente a la variable departamento:String de la case Cliente
     - Parámetros: El departamento seleccionado
     - Retorna: nada */

  cargarCiudadDeptId(evento): void {
    this.ciudadSrvice.obtenerCiudadId(evento.value.id).subscribe(ciud => {
      const FiltroListaCiudades = [];
      ciud.forEach(elemento => {
        FiltroListaCiudades.push({
          "id": elemento.id,
          "nombre": elemento.nombre,
          "departamento": {
            "id": elemento.departamento.id,
            "nombre": elemento.departamento.nombre
          }
        });
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

  /* Este método revisa los parámetros de la URL y extrae el ID del cliente.
     Si el ID no es nulo ejecuta el service que obtiene el cliente por su ID
     - Parámetros: ninguno
     - Retorna: nada */
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
          fijo: this.cliente.fijo,
          // correo: this.cliente.correo,
          departamento: this.cliente.ciudad.departamento, // Se carga el objeto Departamento completo
          ciudad: this.cliente.ciudad, // Se carga el objeto Ciudad completo
          direccion: this.cliente.direccion,
          // codigo_postal: this.cliente.codigo_postal
        });
      });
    }
  }

  cargarCiudadDeptIdporDefecto(departamento: Departamento): void {
    this.ciudadSrvice.obtenerCiudadId(departamento.id).subscribe(ciud => {
      const FiltroListaCiudades = [];
      ciud.forEach(elemento => {
        FiltroListaCiudades.push({
          "id": elemento.id,
          "nombre": elemento.nombre,
          "departamento" :{
            "id": elemento.departamento.id,
            "nombre": elemento.departamento.nombre
          }
        });
      });
      this.listaCiudades = FiltroListaCiudades;
    });
  }
}
