import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-usuario-all',
  templateUrl: './usuario-all.component.html',
  styleUrls: ['./usuario-all.component.css']
})
export class UsuarioAllComponent  implements AfterViewInit {
  datos:any;
  destroy$:Subject<boolean>=new Subject<boolean>();

  respUsuario:any;
  
  estadoEnumValues = Object.values(estadosEnum);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //@ViewChild(MatTable) table!: MatTable<VideojuegoAllItem>;
  dataSource= new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['nombre', 'correo', 'telefono' ,'estado', 'acciones'];

  constructor(private router:Router,
    private route:ActivatedRoute,
    private gService:GenericService) {
  }
  ngAfterViewInit(): void {
    this.listaUsuarios();
  }

  listaUsuarios(){
    //localhost:3000/factura
    this.gService.list('usuario/all')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        console.log(data);
        this.datos=data;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;        
      });   
  }

  deshabilitar(user:any){
    user.estado = 0;
    this.gService.update('usuario',user)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
      //Obtener respuesta
      this.respUsuario=data;
      this.router.navigate(['/usuario/all'],{
        queryParams: {update:'true'}
      });
    });
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
enum estadosEnum {
  DESHABILITADO='Desabilitado',
  HABILITADO= 'Habilitado',
}
