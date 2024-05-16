import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdenIndexComponent } from './orden-index/orden-index.component';
import { OrdenCheckoutComponent } from './orden-checkout/orden-checkout.component';
import { AuthGuard } from '../share/guards/auth.guard';


const routes: Routes = [
  {
    path:'orden',
    component: OrdenIndexComponent,
    canActivate:[AuthGuard],
    data:{
      tipoUsuarios: (["ADMIN","CLIENTE"])
    }
  },
  {
    path:'orden/checkout',
    component: OrdenCheckoutComponent,
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
export class OrdenRoutingModule { }
