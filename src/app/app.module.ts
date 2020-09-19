import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { ClienteService } from './clientes/cliente.service';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { FormProveedoresComponent } from './proveedores/form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule} from '@angular/material/tooltip';

import { FormClientesComponent } from './clientes/form.component';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule } from '@angular/material/select';


import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialogConfig} from '@angular/material/dialog';
import { DetalleComponent } from './proveedores/detalle/detalle.component';
import { DetalleClienteComponent } from './clientes/detalle-cliente/detalle-cliente.component';
import { TipoenviosComponent } from './tipoenvios/tipoenvios.component';

import { TipoEnvio } from './tipoenvios/tipoenvios';
import { FormtipoenviosComponent } from './tipoenvios/formtipoenvios/formtipoenvios.component';
import { DetalleTipoEnvioComponent } from './tipoenvios/detalle-tipo-envio/detalle-tipo-envio.component';
import { EnvioCiudadComponent } from './enviociudad/envio-ciudad/envio-ciudad.component';
import { FormenviociudadComponent } from './enviociudad/formenviociudad/formenviociudad.component';
import { EmpresaTransportadoraComponent } from './EmpresaTransportadora/empresa-transportadora/empresa-transportadora.component';
import { FormEmpresaTransportadoraComponent } from './EmpresaTransportadora/form-empresa-transportadora/form-empresa-transportadora.component';
import { DetalleEmpresaTransportadoraComponent } from './EmpresaTransportadora/detalle-empresa-transportadora/detalle-empresa-transportadora.component';
import { PedidoComponent } from './pedido/pedido.component';
import { FormPedidoComponent } from './pedido/form-pedido/form-pedido.component';
import { DetallePedidoComponent } from './pedido/detalle-pedido/detalle-pedido.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EstadoEnvioCiudadComponent } from './estado-envio-ciudad/estado-envio-ciudad.component';
import { FormEstadoEnvioCiudadComponent } from './estado-envio-ciudad/form-estado-envio-ciudad/form-estado-envio-ciudad.component';
import { DetalleEstadoEnvioCiudadComponent } from './estado-envio-ciudad/detalle-estado-envio-ciudad/detalle-estado-envio-ciudad.component';

const routes: Routes = [
    {path: '', redirectTo: '/clientes', pathMatch: 'full'},
    {path: 'clientes', component: ClientesComponent},
    {path: 'proveedores', component: ProveedoresComponent},
    {path: 'proveedores/form', component: FormProveedoresComponent},
    {path: 'proveedores/form/:id', component: FormProveedoresComponent},
    {path: 'clientes/form', component: FormClientesComponent},
    {path: 'clientes/form/:id', component: FormClientesComponent},
    {path: 'tipoenvios', component: TipoenviosComponent},
    {path: 'enviociudad', component: EnvioCiudadComponent},
    {path: 'EmpresaTransportadora', component: EmpresaTransportadoraComponent},
    {path: 'pedido', component: PedidoComponent},
    {path: 'EstadoEnvioCiudad', component: EstadoEnvioCiudadComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    ClientesComponent,
    FormProveedoresComponent,
    ProveedoresComponent,
    DetalleComponent,
    FormClientesComponent,
    DetalleClienteComponent,
    TipoenviosComponent,
    FormtipoenviosComponent,
    DetalleTipoEnvioComponent,
    EnvioCiudadComponent,
    FormenviociudadComponent,
    EmpresaTransportadoraComponent,
    FormEmpresaTransportadoraComponent,
    DetalleEmpresaTransportadoraComponent,
    PedidoComponent,
    FormPedidoComponent,
    DetallePedidoComponent,
    EstadoEnvioCiudadComponent,
    FormEstadoEnvioCiudadComponent,
    DetalleEstadoEnvioCiudadComponent,
    EstadoEnvioCiudadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatMomentDateModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule
    ],
  entryComponents: [ FormProveedoresComponent ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
