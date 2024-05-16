import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidoIndexComponent } from './pedido-index/pedido-index.component';
import { AuthGuard } from '../share/guards/auth.guard';
const routes: Routes = [
  {
    path:'pedido',
    component: PedidoIndexComponent,
    canActivate:[AuthGuard],
    data:{
      tipoUsuarios: (["ADMIN"])
    }
  },
  {
    path:'pedido/:id',
    component: PedidoIndexComponent,
    canActivate:[AuthGuard],
    data:{
      vefiryId: true,
      tipoUsuarios: (["VENDEDOR"])
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoRoutingModule { }
