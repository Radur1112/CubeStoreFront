import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-factura-detail',
  templateUrl: './factura-detail.component.html',
  styleUrls: ['./factura-detail.component.css']
})
export class FacturaDetailComponent {
  datos:any;
  destroy$:Subject<boolean>=new Subject<boolean>();

  constructor( private gService: GenericService,
    private route:ActivatedRoute
    ){
      let id=this.route.snapshot.paramMap.get('id');
      if(!isNaN(Number(id))){
        this.obtenerFactura(Number(id));
      }
  }
  obtenerFactura(id:any){
    this.gService
    .get('factura',id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
      console.log(data);
        this.datos=data; 
    });
   
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
