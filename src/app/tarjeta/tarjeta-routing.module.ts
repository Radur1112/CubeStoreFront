import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TarjetaIndexComponent } from './tarjeta-index/tarjeta-index.component';
import { TarjetaFormComponent } from './tarjeta-form/tarjeta-form.component';
import { AuthGuard } from '../share/guards/auth.guard';

const routes: Routes = [
  {
    path:'tarjeta',
    component: TarjetaIndexComponent,
    canActivate:[AuthGuard],
    data:{
      tipoUsuarios: (["ADMIN","CLIENTE"])
    }
  },
  {
    path:'tarjeta/create',
    component: TarjetaFormComponent,
    canActivate:[AuthGuard],
    data:{
      tipoUsuarios: (["ADMIN","CLIENTE"])
    }
  },
  {
    path:'tarjeta/update/:id',
    component: TarjetaFormComponent,
    canActivate:[AuthGuard],
    data:{
      tipoUsuarios: (["ADMIN","CLIENTE"])
    }
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TarjetaRoutingModule { }
