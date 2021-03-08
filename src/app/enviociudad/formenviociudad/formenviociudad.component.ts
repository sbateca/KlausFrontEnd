import { Component, OnInit, Inject } from '@angular/core';
import { Enviociudad } from '../Enviociudad';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Formulario
import { TipoEnvio } from '../../tipoenvios/tipoenvios';
import { TipoenviosService } from '../../tipoenvios/tipoenvios.service'; // Tipo Envios Service
import { DepartamentoService } from '../../departamentos/departamento.service';
import { Departamento } from '../../departamentos/departamento';
import { Ciudad } from '../../ciudades/ciudad';
import { CiudadService } from '../../ciudades/ciudad.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnviociudadService } from '../enviociudad.service';
import { EmpresaTransportadora } from '../../EmpresaTransportadora/empresa-transportadora';
import { EmpresaTransportadoraService } from '../../EmpresaTransportadora/empresa-transportadora.service';




@Component({
  selector: 'app-formenviociudad',
  templateUrl: './formenviociudad.component.html',
  styleUrls: ['./formenviociudad.component.css']
})
export class FormenviociudadComponent implements OnInit {

  public envioCiudad: Enviociudad = new Enviociudad();
  public camposformularioEnviociudad: FormGroup; // Fromulario
  public listatipoenvio: TipoEnvio[];
  public listadepartamentos: Departamento[];
  public listaciudadpordep: Ciudad[];
  public listaEmpresaTransportadora: EmpresaTransportadora[];
  public ciudad: Ciudad;

  constructor(private constructorFormularioEnviociudad: FormBuilder,
              private tipoenvioservice: TipoenviosService,
              private departamentoservice: DepartamentoService,
              private ciudadservice: CiudadService,
              private enviociudadservice: EnviociudadService,
              private empresaTransportadoraService: EmpresaTransportadoraService,
              private referenciaVentanaModal: MatDialogRef<FormenviociudadComponent>,
              @Inject(MAT_DIALOG_DATA) public idEnvioCiudad: number) { }

  ngOnInit(): void {
    this.Crearformulario();
    this.ObtenerListaTipoEnvio();
    this.ObtenerListaDepartamento();
    this.ObtenerListaEmpresaTransportadora();
    this.cargarEnvioCiudad();
  }

  // Crear Formulario
  Crearformulario(): void {
    this.camposformularioEnviociudad = this.constructorFormularioEnviociudad.group({
      tipoEnvio: ['', Validators.required],
      departamento: ['', Validators.required],
      ciudad: ['', Validators.required],
      empresaTransportadora: ['', Validators.required],
      valorEnvio: ['', Validators.required]
    });
  }

  // Obtener Lista Tipo Envio
  ObtenerListaTipoEnvio(): void {
    this.tipoenvioservice.verTipoEnvio().subscribe( tipoenvio => {
      const FiltroListaTipoEnvio = [];
      tipoenvio.forEach( elemento => {
        FiltroListaTipoEnvio.push({
          "id": elemento.id,
          "nombre": elemento.nombre,
          "descripcion": elemento.descripcion
        });
      });
      this.listatipoenvio = FiltroListaTipoEnvio;
    });
  }
  // Obtener Departamento
  ObtenerListaDepartamento(): void {
    this.departamentoservice.obtenerDepartamentos().subscribe(departamentos => {
      this.listadepartamentos = departamentos;
    });
  }
  // Obtener Lista de Ciudades de Departamento Seleccionado
  ObtenerListaCiudadesPorDep(evento): void {
    this.ciudadservice.obtenerCiudadId(evento.value.id).subscribe( ciudades => {
      const FiltroListaCiudades = [];
      ciudades.forEach(elemento => {
        FiltroListaCiudades.push({
          "id": elemento.id,
          "nombre": elemento.nombre,
          "departamento" :{
            "id": elemento.departamento.id,
            "nombre": elemento.departamento.nombre
          }
        });
      });
      this.listaciudadpordep = FiltroListaCiudades;
    });
  }

  // Obtener Lista Empresa Transportadora
  ObtenerListaEmpresaTransportadora(): void {
    this.empresaTransportadoraService.verEmpresaTransportadora().subscribe( empresatransportadora => {
      this.listaEmpresaTransportadora = empresatransportadora;
    });
  }

  // Cancelar formulario
  cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }

  // Enviar formulario
  enviarFormulario() {
    if (this.camposformularioEnviociudad.invalid) {
      return this.camposformularioEnviociudad.markAllAsTouched();
    } else {
      this.referenciaVentanaModal.close(this.camposformularioEnviociudad.value);
    }
  }

    // Cargar Envio Ciudad en formulario editar
  cargarEnvioCiudad(): void {
    if (this.idEnvioCiudad) {
  
      this.enviociudadservice.verEnvioCiudadPorId(this.idEnvioCiudad).subscribe(enviociudad => {
        this.envioCiudad = enviociudad;
        this.CargarListaCiudadesPorDefecto(this.envioCiudad.ciudad.departamento);
        
        this.camposformularioEnviociudad.setValue({
           tipoEnvio: this.envioCiudad.tipoEnvio, // Se carga el objeto TipoEnvio completo
           ciudad: this.envioCiudad.ciudad, // Se carga el objeto Ciudad completo
           departamento: this.envioCiudad.ciudad.departamento, // Se carga el objeto Departamento completo
           empresaTransportadora: this.envioCiudad.empresaTransportadora, // Se carga el objeto Empresa Transportadora completo
           valorEnvio: this.envioCiudad.valorEnvio
        });
      });
    }
  }

    // Obtener Lista de Ciudades de Departamento Por Defecto
  CargarListaCiudadesPorDefecto(departamento: Departamento): void {
    // console.log(evento);
    this.ciudadservice.obtenerCiudadId(departamento.id).subscribe( ciudades => {
      const FiltroListaCiudades = [];
      ciudades.forEach(elemento => {
        FiltroListaCiudades.push({
          "id": elemento.id,
            "nombre": elemento.nombre,
            "departamento" :{
              "id": elemento.departamento.id,
              "nombre": elemento.departamento.nombre
            }
        });
      });
      this.listaciudadpordep = FiltroListaCiudades;
    });
  }

  comparaDepartamentos( a1: Departamento, a2: Departamento): boolean {

    if (a1 === undefined && a2 === undefined) { // a1, a2  identico undefined
      return true;
    }

    return ( a1 === null || a2 === null || a1 === undefined || a2 === undefined )
    ? false : a1.id === a2.id;
  }

  comparaCiudades( c1: Ciudad, c2: Ciudad): boolean {

    if (c1 === undefined && c2 === undefined) { // a1, a2  identico undefined
      return true;
    }

    return ( c1 === null || c2 === null || c1 === undefined || c2 === undefined )
    ? false : c1.id === c2.id;
  }

  comparaTipoEnvio( c1: TipoEnvio, c2: TipoEnvio): boolean {

    if (c1 === undefined && c2 === undefined) { // a1, a2  identico undefined
      return true;
    }

    return ( c1 === null || c2 === null || c1 === undefined || c2 === undefined )
    ? false : c1.id === c2.id;
  }

  ComparaEmpresaTransportadora( ET1: EmpresaTransportadora, ET2: EmpresaTransportadora): boolean {

    if (ET1 === undefined && ET2 === undefined) { // ET1, ET2  identico undefined
      return true;
    }

    return ( ET1 === null || ET2 === null || ET1 === undefined || ET2 === undefined )
    ? false : ET1.id === ET2.id;
  }
}
