import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturaRoutingModule } from './factura-routing.module';
import { FacturaIndexComponent } from './factura-index/factura-index.component';
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
import {MatListModule} from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { FacturaAllComponent } from './factura-all/factura-all.component';
import { FacturaDetailComponent } from './factura-detail/factura-detail.component';
import { EvaluacionComponent } from './evaluacion/evaluacion.component';

@NgModule({
  declarations: [
    FacturaIndexComponent,
    FacturaAllComponent,
    FacturaDetailComponent,
    EvaluacionComponent
  ],
  imports: [
    CommonModule,
    FacturaRoutingModule,
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
    MatListModule,
    ReactiveFormsModule
  ],
  exports: [
    EvaluacionComponent
  ]
})
export class FacturaModule { }
