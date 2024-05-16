import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-producto-all',
  templateUrl: './producto-all.component.html',
  styleUrls: ['./producto-all.component.css']
})
export class ProductoAllComponent implements AfterViewInit {
  datos:any;
  destroy$:Subject<boolean>=new Subject<boolean>();

  idUsuario:any;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //@ViewChild(MatTable) table!: MatTable<VideojuegoAllItem>;
  dataSource= new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['nombre', 'cantidad', 'precio', 'estado' ,'acciones'];

  constructor(private router:Router,
    private route:ActivatedRoute,
    private gService:GenericService) {
      let id=this.route.snapshot.paramMap.get('id');
      if(!isNaN(Number(id))){
        this.idUsuario = Number(id);
      } else {
        this.idUsuario = 0;
      }
    
  }

  ngAfterViewInit(): void {
    let id = this.idUsuario;
    if (id != 0){
      this.listaProductos(Number(id));
    } else {
      this.listaProductos("");
    }
   
  }
  listaProductos(id:any){
    //localhost:3000/factura
    this.gService.get('producto/all',id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        console.log(data);
        this.datos=data;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;        
      });   
  }
  detalle(id:number){
    this.router.navigate(['/producto',id],
    {
      relativeTo:this.route
    })
  }
  update(id:number){
    this.router.navigate(['/producto/update/',id],
    {
      relativeTo:this.route
    })
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
