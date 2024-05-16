import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './home/inicio/inicio.component';
import { ProductoIndexComponent } from './producto/producto-index/producto-index.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';

const routes: Routes = [
  { path:'producto',component: ProductoIndexComponent},
  { path:'', redirectTo:'/producto' ,pathMatch:'full'},
  { path:'**',component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
