import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';//implementamos
import { DepartamentoService } from '../departamentos/departamento.service';
import { Departamento } from '../departamentos/departamento';
import { Ciudad } from '../ciudades/ciudad';
import { CiudadService } from '../ciudades/ciudad.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public listaDepartamentos:Departamento[];
  public cliente:Cliente =new Cliente();
  public departamentoseleccionado:Departamento;
  public listaCiudades:Ciudad[]; 
  public IdCiudadSelecc: Number;
  public CiudadSelec:Ciudad;
  titulo:string = "Crear cliente";

  // constructor de la clase. Acá se instancian variables
  constructor(private clienteService:ClienteService,
              private router:Router,
              private activatedRoute: ActivatedRoute,
              private departamentoService:DepartamentoService,
              private ciudadSrvice:CiudadService) { }


/*
    Al iniciar el componente se invocan los siguientes métodos:
      - cargarCliente(): carga el cliente por su id o carga un cliente vacío si no lo encuentra
      - getDept(): obtiene la lista de departamentos
*/
  ngOnInit() {
    this.cargarCliente();
    this.getDept();
   }



/*
    Este método ejecuta el service que lista los departamentos 
    y asigna el listado de departamentos a la variable departamento:Departamento[]
      - Parámetros: ninguno
      - Retorna: nada
*/
 getDept():void{
    this.departamentoService.obtenerDepartamentos().subscribe(dpto=>{
      this.listaDepartamentos=dpto;//Actualiza listado
    },
    error=>{
      console.log('Error al listar los usuarios desde el servidor')
    }
  );
}


/*
  Este método asigna a la variable de clase CiudadSelecc el objeto de la ciudad seleccionada, 
  en el formulario
*/
 asignarCiudadSeleccionada(CiudadSelecc):void{
   this.IdCiudadSelecc=this.CiudadSelec.id;
   this.cliente.ciudad=this.CiudadSelec.nombre;
 }
/*
  Este método obtiene las ciudades pertenecientes al departamento seleccionado
  y asigna el nombre del departamente a la variable departamento:String de la case Cliente
    - Parámetros: El departamento seleccionado
    - Retorna: nada
*/
 cargarCiudadDeptId(departamentoseleccionado):void{
    this.ciudadSrvice.obtenerCiudadId(departamentoseleccionado.id).subscribe(ciud=>{
      this.cliente.departamento=departamentoseleccionado.nombre;
      this.listaCiudades = ciud;
    });
  }
  

/*
  Este método revisa los parámetros de la URL y extrae el ID del cliente.
  Si el ID no es nulo ejecuta el service que obtiene el cliente por su ID
  - Parámetros: ninguno
  - Retorna: nada
*/
  cargarCliente():void{
    this.activatedRoute.params.subscribe(params=>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente)=>this.cliente=cliente)
    }
    })
  }


/*
  Este método ejecuta el service que inserta un cliente (el que se ha llenado en el formulario)
  y redirecciona a la lista de clientes. Finalmente lanza una alerta (usando SweetAlert)
  - Parámetros: ninguno
  - Retorna: nada
*/
  public create():void {

    console.log(this.cliente);
    console.log(this.IdCiudadSelecc);

    this.clienteService.create(this.cliente, this.IdCiudadSelecc)
    .subscribe(response=>{//Sube a la base de datos
      this.router.navigate(['/clientes'])//vamos a la clientes  muestra la tabla
       swal.fire('Nuevo cliente', `Cliente ${this.cliente.nombres} creado con exito!`, 'success')
    }
    );
  }



  /*
      Este método ejecuta el service que actualiza el cliente (no nulo) y luego redirecciona
      al listado de clientes. Finalmente lanza una alerta (usando SweetAlert)
      - Parámetros: ninguno
      - Retorna: nada
  */
  update():void{
    this.clienteService.update(this.cliente)
    .subscribe(cliente=>{
      this.router.navigate(['/clientes'])//vamos a cualquier ruta
      swal.fire('Cliente Actializado', `Cliente ${this.cliente.nombres} actualizado con éxito!`,'success')
    })
  }
}
