import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { EvaluacionComponent } from '../evaluacion/evaluacion.component'; 

interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-factura-all',
  templateUrl: './factura-all.component.html',
  styleUrls: ['./factura-all.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class FacturaAllComponent implements AfterViewInit {
  datos:any = [];
  destroy$:Subject<boolean>=new Subject<boolean>();

  currentUser:any;
  idUsuario:any;
  isCliente:boolean;
  isVendedor:boolean;
  selected:boolean = true;

  evaluaciones:any = [];

  estadoEnumValues = Object.values(estadosEnum);
  enums = estadosEnum

  facturaProductos:any;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //@ViewChild(MatTable) table!: MatTable<VideojuegoAllItem>;
  dataSource= new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['direccion', 'fecha', 'total', 'estado' ,'acciones'];

  constructor(private router:Router,
    private route:ActivatedRoute,
    private gService:GenericService,
    public dialog: MatDialog,
    private auth:AuthenticationService) {

    this.auth.currentUser.subscribe((x)=>(this.currentUser=x));
     
    this.auth.currentUser.subscribe((x)=>{
      if(this.currentUser!=null){
        this.isCliente = x.user.tiposUsuario.some(element => element.tipoUsuario === 'CLIENTE')
        this.isVendedor = x.user.tiposUsuario.some(element => element.tipoUsuario === 'VENDEDOR')
      }
    });
      let idd=this.route.snapshot.paramMap.get('id');
      if(!isNaN(Number(idd))){
        this.idUsuario = Number(idd);
      } else {
        this.idUsuario = 0;
      }
      this.listaEvaluaciones();
  }
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngAfterViewInit(): void {
    this.iniciarTabla();
/*
    this.gService.list('evaluacion/evaluado/'+3)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        console.log("Evaluado Como Cliente")
        const comoCliente = data.filter(item => item.evaluador === 2)
        console.log(comoCliente)
        console.log(comoCliente.reduce((sum, item) => sum + item.calificacion, 0)/comoCliente.length)
        console.log(data)
        console.log("Evaluado Como Vendedor")
        const ComoVendedor = data.filter(item => item.evaluador === 1)
        console.log(ComoVendedor)
        console.log(ComoVendedor.reduce((sum, item) => sum + item.calificacion, 0))
        console.log(ComoVendedor.reduce((sum, item) => sum + item.calificacion, 0)/ComoVendedor.length)
      });  */
  }

  iniciarTabla() {
    let id = this.idUsuario;
    if (id != 0){
      if (this.isVendedor){
        this.listaFacturasVendedor(Number(id));
        this.selected = true;
      } else {
        if (this.isCliente){
          this.listaFacturasCliente(Number(id));
          this.selected = false;
        }
      }
    } else {
      this.listaFacturasCliente("");
    }
  }

  isEvaluated(item:any){  
    if(this.selected) {
      return this.evaluaciones.some(element => element.idUsuarioEvaluador === this.currentUser.user.id && element.idUsuarioEvaluado === item.idUsuario && element.idFactura === item.id && element.evaluador === 2);
    } else {
      return this.evaluaciones.some(element => element.idUsuarioEvaluador === this.currentUser.user.id && element.idUsuarioEvaluado === item.producto.idUsuario && element.idFactura === item.idFactura && element.evaluador === 1);
    }
  }

  openEvaluacion(dato:any) {
    let dats: any;
    if(this.selected) {
      dats = {
          ['idUsuarioEvaluador']:this.currentUser.user.id,
          ['idUsuarioEvaluado']: dato.idUsuario,
          ['idFactura']: dato.id,
          ['evaluador']: 2,
        }
    } else {
      dats = {
          ['idUsuarioEvaluador']:this.currentUser.user.id,
          ['idUsuarioEvaluado']: dato[0].producto.idUsuario,
          ['idFactura']: dato[0].idFactura,
          ['evaluador']: 1,
        }
    }
    const dialogRef = this.dialog.open(EvaluacionComponent, {
      width: '400px', // Adjust the width as needed
      data: dats
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listaEvaluaciones();
    });
  }

  listaVendedoresFactura(factura:any) {
    const setVendedores = new Set<any>(
      factura.productos.map(pro => pro.producto.idUsuario)
    );

    const vendedores = [];
    Array.from(setVendedores).forEach(element => {
      const productos = factura.productos.filter((product) => product.producto.idUsuario === element);
      vendedores.push(productos);
    });

    this.facturaProductos = vendedores
  }

  listaFacturasCliente(id:any){
    //localhost:3000/factura
    this.gService.get('factura/all',id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.datos=data;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;     
        
        this.selected = false;   
      });   
  }

  listaFacturasVendedor(id:any){
    //localhost:3000/factura
    this.gService.list('factura')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.datos = [];
        data.forEach(element => {
          if (element.productos.some(x => x.producto.idUsuario === id)){
            this.datos.push(element);
          }
        });
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;    
        
        this.selected = true;    
      });   
  }

  listaEvaluaciones() {
    this.gService.list('evaluacion')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.evaluaciones = data;
        console.log(this.evaluaciones)
      });   
  }

  detalle(id:number){
    this.router.navigate(['/factura',id],
    {
      relativeTo:this.route
    })
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

enum estadosEnum {
  PENDIENTE= 'Pendiente',
  EN_PROGRESO= 'En progreso',
  ENTREGADO= 'Entregado',
  FINALIZADO='Finalizado'
}