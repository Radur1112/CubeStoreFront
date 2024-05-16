import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

interface Images {
  url: string;
}

@Component({
  selector: 'app-pedido-index',
  templateUrl: './pedido-index.component.html',
  styleUrls: ['./pedido-index.component.css']
})
export class PedidoIndexComponent implements AfterViewInit {
  datos:any;
  destroy$:Subject<boolean>=new Subject<boolean>();
  images: Images[] = [];
  idVendedor:any;
  estado:any;
  estadoEnumValues = Object.values(estadosEnum);
  productoEnumValues = Object.values(productosEnum);
  enums = estadosEnum;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //@ViewChild(MatTable) table!: MatTable<VideojuegoAllItem>;
  dataSource= new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['imagen', 'factura', 'nombre', 'cantidad', 'estado', 'acciones'];

  constructor(private router:Router,
    private noti: NotificacionService,
    private route:ActivatedRoute,
    private gService:GenericService) {
      let id=this.route.snapshot.paramMap.get('id');
      if(!isNaN(Number(id))){
        this.idVendedor = Number(id);
      } else {
        this.idVendedor = 0;
      }
      this.getImages();

  }

  ngAfterViewInit(): void {
    let id = this.idVendedor;
    if (id != 0){
      this.listaProductos(Number(id));
    } else {
      this.listaProductos("");
    }
   
  }
  listaProductos(id:any){
    //localhost:3000/factura
    this.gService.get('pedido',id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        console.log(data);
        this.datos=data;
        this.estado = this.enums[data[0].estado]
        console.log(this.estado);
        
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;    
      });   
  }
  compareEnumValues(item1: any, item2: any): boolean {
    return item1 && item2 ? item1 === item2 : false;
  }
  actualizarEstado(row:any, event:any){
    const estado = Object.keys(estadosEnum).find(key => estadosEnum[key] === event);
    row.estado = estado;
    this.gService.update('pedido',row)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {

      this.noti.mensaje('Estado',
      'Estado cambiado a ' + event,
      TipoMessage.success)
      
      this.gService
      .get('factura',row.idFactura)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        const facturas = data.productos;

        const status = facturas.some(product => product.estado === "ENTREGADO") ? (facturas.every(product => product.estado === "ENTREGADO") ? "FINALIZADO" : "EN_PROGRESO") : "PENDIENTE";
        
        data.estado = status;
        this.gService.update('factura',data)
        .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
          
        });
      });
    });
  }

  getImages(){
    this.gService.list('images/all')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.images=data;
      });
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

enum productosEnum {
  PENDIENTE= 'Pendiente',
  ENTREGADO= 'Entregado'
}

enum estadosEnum {
  PENDIENTE= 'Pendiente',
  EN_PROGRESO= 'En progreso',
  ENTREGADO= 'Entregado',
  FINALIZADO='Finalizado'
}