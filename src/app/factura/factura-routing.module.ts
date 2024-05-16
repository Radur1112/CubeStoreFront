import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturaIndexComponent } from './factura-index/factura-index.component';
import { FacturaAllComponent } from './factura-all/factura-all.component';
import { FacturaDetailComponent } from './factura-detail/factura-detail.component';
import { AuthGuard } from '../share/guards/auth.guard';

const routes: Routes = [
  {path:'factura', component: FacturaIndexComponent},
  
  {path:'factura/:id', component: FacturaDetailComponent},

  {path:'factura/all', component: FacturaAllComponent},

  {
    path:'factura/all/:id',
    component: FacturaAllComponent,
    canActivate:[AuthGuard],
    data:{
      vefiryId: true,
      tipoUsuarios: (["CLIENTE", "VENDEDOR"])
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaRoutingModule { }
