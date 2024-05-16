import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardVendedorComponent } from './dashboard-vendedor/dashboard-vendedor.component';

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
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardAdminComponent,
    DashboardVendedorComponent,

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CommonModule,
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
    FormsModule,
    ReactiveFormsModule, 
  ]
})
export class DashboardModule { }
