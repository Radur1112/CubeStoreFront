import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-factura-index',
  templateUrl: './factura-index.component.html',
  styleUrls: ['./factura-index.component.css']
})
export class FacturaIndexComponent {
  datos:any;//Respuesta del API
  destroy$:Subject<boolean>=new Subject<boolean>();

  constructor(private gService:GenericService,
    private dialog:MatDialog
    ){
    this.listaFacturas(); 
  }

  //Listar los facturas llamando al API
  listaFacturas(){
    //localhost:3000/factura
    this.gService.list('factura/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        console.log(data);
        this.datos=data;
      });
    
  }
}
