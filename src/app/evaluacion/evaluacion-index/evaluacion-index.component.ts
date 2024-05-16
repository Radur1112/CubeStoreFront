import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-evaluacion-index',
  templateUrl: './evaluacion-index.component.html',
  styleUrls: ['./evaluacion-index.component.css']
})
export class EvaluacionIndexComponent {
  datos:any;//Respuesta del API
  destroy$:Subject<boolean>=new Subject<boolean>();
  currentUser:any;
  id:any;
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

    this.listaEvaluaciones();
  }
  
  listaEvaluaciones(){
    this.gService.list('evaluacion/idUsuarioEvaluado/'+this.currentUser.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.datos=data;
      });
  }
}
