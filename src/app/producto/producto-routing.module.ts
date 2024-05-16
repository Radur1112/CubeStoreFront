import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoIndexComponent } from './producto-index/producto-index.component';
import { ProductoAllComponent } from './producto-all/producto-all.component';
import { ProductoDetailComponent } from './producto-detail/producto-detail.component';
import { ProductoFormComponent } from './producto-form/producto-form.component';
import { AuthGuard } from '../share/guards/auth.guard';


const routes: Routes = [
  {path:'producto', component: ProductoIndexComponent},

  {
    path:'producto/create',
    component: ProductoFormComponent,
    canActivate:[AuthGuard],
    data:{
      tipoUsuarios: (["ADMIN","VENDEDOR"])
    }
  },
  
  {path:'producto/:id', component: ProductoDetailComponent},

  {path:'producto/all', component: ProductoAllComponent},

  {
    path:'producto/all/:id',
    component: ProductoAllComponent,
    canActivate:[AuthGuard],
    data:{
      tipoUsuarios: (["ADMIN","VENDEDOR"])
    }
  },

  {
    path:'producto/update/:id',
    component: ProductoFormComponent,
    canActivate:[AuthGuard],
    data:{
      tipoUsuarios: (["ADMIN","VENDEDOR"])
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
