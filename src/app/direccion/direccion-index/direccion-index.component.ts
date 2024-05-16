import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-direccion-index',
  templateUrl: './direccion-index.component.html',
  styleUrls: ['./direccion-index.component.css']
})
export class DireccionIndexComponent {
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
    
    this.auth.currentUser.subscribe((x)=>{
      if(this.currentUser!=null){
        this.isVendedor = x.user.tiposUsuario.some(element => element.tipoUsuario === 'VENDEDOR')
      }
    });

    this.listaDirecciones();
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
  
  listaDirecciones(){
    this.gService.list('direccion/usuario/'+this.currentUser.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.datos=data;
      });
  }

  create(){
    this.router.navigate(['/direccion/create'],
    {
      relativeTo:this.route
    })
  }

  update(id:any){
    this.router.navigate(['/direccion/update/', id],
    {
      relativeTo:this.route
    })
  }
}
