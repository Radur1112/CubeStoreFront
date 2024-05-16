import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardVendedorComponent } from './dashboard-vendedor/dashboard-vendedor.component';
import { AuthGuard } from '../share/guards/auth.guard';

const routes: Routes = [
  {path:'dashboard/admin', component: DashboardAdminComponent,
  canActivate:[AuthGuard],
  data:{
    tipoUsuarios: (["ADMIN"])
  }
  },
  {path:'dashboard/vendedor', component: DashboardVendedorComponent,
  canActivate:[AuthGuard],
  data:{
    tipoUsuarios: (["VENDEDOR"])
  }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
