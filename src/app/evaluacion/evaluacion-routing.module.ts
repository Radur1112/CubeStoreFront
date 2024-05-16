import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluacionIndexComponent } from './evaluacion-index/evaluacion-index.component';

const routes: Routes = [
  {path:'evaluacion', component: EvaluacionIndexComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionRoutingModule { }
