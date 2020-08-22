import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialogConfig} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


import { DetalleComponent } from './proveedores/detalle/detalle.component';
import { DetalleClienteComponent } from './clientes/detalle-cliente/detalle-cliente.component';
import { TallaComponent } from './tallas/talla.component';
import { ColorComponent } from './colores/color.component';
import { FormTallaComponent } from './tallas/formsTallas/form-talla.component';
import { TallaDetalleComponent } from './tallas/detalleTalla/talla-detalle.component';
import { FormColorComponent } from './colores/formsColores/form-color.component';
import { ColorDetalleComponent } from './colores/detalleColor/color-detalle.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { TipoTallaComponent } from './tiposTallas/tipo-talla.component';
import { TipoTallaFormComponent } from './tiposTallas/tipoTallaForm/tipo-talla-form.component';
import { TipoTallaDetalleComponent } from './tiposTallas/tipoTallaDetalle/tipo-talla-detalle.component';
import { MaterialComponent } from './materiales/material.component';
import { MaterialFormComponent } from './materiales/materialForm/material-form.component';
import { MaterialDetalleComponent } from './materiales/materialDetalle/material-detalle.component';
import { PiezaComponent } from './piezas/pieza.component';
import { FormPiezaComponent } from './piezas/formPieza/form-piezas.component';
import { ProductoComponent } from './productos/producto.component';
import { ProductoFormComponent } from './productos/productoForm/producto-form.component';
import { ProductoDetalleComponent } from './productos/productoDetalle/producto-detalle.component';




const routes: Routes = [
    {path: '', redirectTo: '/clientes', pathMatch: 'full'},
    {path: 'clientes', component: ClientesComponent},
    {path: 'proveedores', component: ProveedoresComponent},
    {path: 'proveedores/form', component: FormProveedoresComponent},
    {path: 'proveedores/form/:id', component: FormProveedoresComponent},
    {path: 'clientes/form', component: FormClientesComponent},
    {path: 'clientes/form/:id', component: FormClientesComponent},
    {path: 'tiposTallas', component: TipoTallaComponent},
    {path: 'tallas', component: TallaComponent},
    {path: 'colores', component: ColorComponent},
    {path: 'materiales', component: MaterialComponent},
    {path: 'productos', component: ProductoComponent}
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
    TallaComponent,
    ColorComponent,
    FormTallaComponent,
    TallaDetalleComponent,
    FormColorComponent,
    ColorDetalleComponent,
    TipoTallaComponent,
    TipoTallaFormComponent,
    TipoTallaDetalleComponent,
    MaterialComponent,
    MaterialFormComponent,
    MaterialDetalleComponent,
    PiezaComponent,
    FormPiezaComponent,
    ProductoComponent,
    ProductoFormComponent,
    ProductoDetalleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
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
    ColorPickerModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatTooltipModule
    ],
  entryComponents: [ FormProveedoresComponent ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
