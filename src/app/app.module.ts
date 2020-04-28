import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ClienteService } from './clientes/cliente.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { ClientesPorCiudadComponent } from './clientes/clientes-por-ciudad.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTableDataSource , MatTableModule } from '@angular/material/table';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


const routes:Routes =[
  //{path:'', redirecto: '/clientes', pathMatch:'full'},//home
    {path: '',redirectTo: '/clientes', pathMatch: 'full'},
    {path: 'clientes', component:ClientesComponent},
    {path: 'clientes/form', component:FormComponent},
    {path: 'clientes/form/:id', component:FormComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    ClientesComponent,
    FormComponent,
    ClientesPorCiudadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
