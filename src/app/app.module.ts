import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';
import { HomeModule } from './home/home.module';
import { ToastrModule } from 'ngx-toastr';
import { FacturaModule } from './factura/factura.module';
import { HttpClientModule } from '@angular/common/http';
import { PedidoModule } from './pedido/pedido.module';
import { ProductoModule } from './producto/producto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { OrdenModule } from './orden/orden.module';
import { DireccionModule } from './direccion/direccion.module';
import { TarjetaModule } from './tarjeta/tarjeta.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EvaluacionModule } from './evaluacion/evaluacion.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),

    
    CoreModule,
    ShareModule,


    HomeModule,
    FacturaModule,
    DireccionModule,
    TarjetaModule,
    PedidoModule,
    ProductoModule,
    UsuarioModule,
    OrdenModule,
    DashboardModule,
    EvaluacionModule,

    
    AppRoutingModule,
            
            
      

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
