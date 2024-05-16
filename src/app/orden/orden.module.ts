import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenRoutingModule } from './orden-routing.module';
import { OrdenIndexComponent } from './orden-index/orden-index.component';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card'; 
import {MatButtonModule} from '@angular/material/button'; 
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon'; 
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import { OrdenCheckoutComponent } from './orden-checkout/orden-checkout.component';


@NgModule({
  declarations: [
    OrdenIndexComponent,
    OrdenCheckoutComponent
  ],
  imports: [
    CommonModule,
    OrdenRoutingModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatGridListModule,
    MatListModule,
    FormsModule, ReactiveFormsModule,
  ]
})
export class OrdenModule { }
