import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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


import { FormClientesComponent } from './clientes/form.component';



import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';

// import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialogConfig} from '@angular/material/dialog';
import { DetalleComponent } from './proveedores/detalle/detalle.component';
import { DetalleClienteComponent } from './clientes/detalle-cliente/detalle-cliente.component';


const routes: Routes = [
    {path: '', redirectTo: '/clientes', pathMatch: 'full'},
    {path: 'clientes', component: ClientesComponent},
    {path: 'proveedores', component: ProveedoresComponent},
    {path: 'proveedores/form', component: FormProveedoresComponent},
    {path: 'proveedores/form/:id', component: FormProveedoresComponent},
    {path: 'clientes/form', component: FormClientesComponent},
    {path: 'clientes/form/:id', component: FormClientesComponent}
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
    DetalleClienteComponent
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
    // MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
    ],
  entryComponents: [ FormProveedoresComponent ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
