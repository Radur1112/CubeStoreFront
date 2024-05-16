import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-tarjeta-index',
  templateUrl: './tarjeta-index.component.html',
  styleUrls: ['./tarjeta-index.component.css']
})
export class TarjetaIndexComponent {

  datos:any;//Respuesta del API
  destroy$:Subject<boolean>=new Subject<boolean>();
  currentUser:any;
  isVendedor:boolean;
  constructor(private gService:GenericService,
    private dialog:MatDialog,
    private router:Router,
    private route:ActivatedRoute,
    private httpClient:HttpClient,
    private notificacion: NotificacionService,
    private auth:AuthenticationService
    ){
    this.auth.currentUser.subscribe((x)=>(this.currentUser=x));
    if (this.currentUser != null){
      console.log(this.currentUser)
      this.isVendedor = !this.currentUser.user.tiposUsuario.some(element => element === 'VENDEDOR');
    } else {
      this.isVendedor = false;
    }

    this.listaMetodos();
  }

  ngOnInit(): void {
    this.mensajes();
  }

  mensajes() {
   let register=false;
   let auth='';
   //Obtener parámetros de la URL
   this.route.queryParams.subscribe((params)=>{
    auth=params['auth'] || '';
    if(auth){
      this.notificacion.mensaje(
        'Usuario',
        'Acceso denegado',
        TipoMessage.warning
      )
    }
   })
  }
  
  listaMetodos(){
    this.gService.list('tarjeta/usuario/'+this.currentUser.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        console.log(data);
        this.datos=data;
        console.log(data);
      });
  }

  create(){
    this.router.navigate(['/tarjeta/create'],
    {
      relativeTo:this.route
    })
  }

  update(id:any){
    this.router.navigate(['/tarjeta/update/', id],
    {
      relativeTo:this.route
    })
  }
}
