import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DireccionRoutingModule } from './direccion-routing.module';
import { DireccionIndexComponent } from './direccion-index/direccion-index.component';
import { DireccionFormComponent } from './direccion-form/direccion-form.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import {MatDividerModule} from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';  
import { MatMenuModule } from '@angular/material/menu';
import {MatDialogModule} from "@angular/material/dialog";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DireccionIndexComponent,
    DireccionFormComponent
  ],
  imports: [
    CommonModule,
    DireccionRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule, 
  ]
})
export class DireccionModule { }
