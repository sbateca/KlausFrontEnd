import { NgModule } from '@angular/core';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';



@NgModule({
    imports: [
        MatTableModule,
        MatTableDataSource
    ],
    exports: [
        MatTableModule,
        MatTableDataSource
    ]
})


export class MaterialModulo {}