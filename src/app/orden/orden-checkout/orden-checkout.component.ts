
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CartService, ItemCart } from 'src/app/share/cart.service';
import { GenericService } from 'src/app/share/generic.service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { UsuarioCreateComponent } from 'src/app/usuario/usuario-create/usuario-create.component';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-orden-checkout',
  templateUrl: './orden-checkout.component.html',
  styleUrls: ['./orden-checkout.component.css']
})
export class OrdenCheckoutComponent implements OnInit {
  datos:any;
  subtotal = 0;
  total = 0;
  fecha = Date.now();
  qtyItems = 0;
  currentUser:any;
  tarjetasList: any;
  direccionesList: any;
  evaluacionesList: any;
  evaluaciones: any = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  facturaForm: FormGroup;

  displayedColumns: string[] = ['producto', 'precio', 'cantidad', 'subtotal'];
  dataSource = new MatTableDataSource<any>();
  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private noti: NotificacionService,
    private gService: GenericService,
    private router: Router,
    private route:ActivatedRoute,
    private auth:AuthenticationService
  ) {
    this.auth.currentUser.subscribe((x)=>(this.currentUser=x));
    this.listaTarjetas();
    this.listaDirecciones();
    this.listaEvaluaciones();
    this.formularioReactive();
  }

  ngOnInit(): void {
    this.cartService.currentDataCart$.subscribe(data=>{
      this.datos = data;
      this.dataSource=new MatTableDataSource(data)
    })
    this.subtotal=this.cartService.getSubTotal()
    this.total=this.cartService.getTotal()
    
    this.facturaForm.setValue({
      direccion: this.currentUser.user.direcciones[0].id,
      tarjeta: this.currentUser.user.tarjetas[0].id,
    });
    
   } 
   
   formularioReactive() {
    //[null, Validators.required]
    this.facturaForm=this.fb.group({
      direccion: [null, Validators.required],
      tarjeta: [null, Validators.required],
    })
  }
  listaEvaluaciones() {
    this.gService.list('evaluacion')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.evaluacionesList = data;
        this.evaluacion();
      }); 
  }

  evaluacion() {
    const setVendedores = new Set<any>(
      this.datos.map(pro => pro.producto.idUsuario)
    );
    const vendedores = [];
    Array.from(setVendedores).forEach(element => {
      const productos = this.datos.filter((product) => product.producto.usuario.id === element);
      vendedores.push(productos[0].producto.usuario);
    });

    vendedores.forEach(element => {
      const ComoVendedor = (this.evaluacionesList.filter(item => item.idUsuarioEvaluado === element.id)).filter(item => item.evaluador === 1)

      let detalle = {
        ['vendedor']: element.nombre,
        ['calificacion']: (ComoVendedor.reduce((sum, item) => sum + item.calificacion, 0)/ComoVendedor.length).toFixed(2),
      }

      this.evaluaciones.push(detalle);
    });
  }
  
  listaTarjetas() {
    this.listaTarjetas = null;
    this.gService.list('tarjeta/usuario/'+this.currentUser.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.tarjetasList=data;
      });
  }

  listaDirecciones() {
    this.listaDirecciones = null;
    this.gService.list('direccion/usuario/'+this.currentUser.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.direccionesList=data;
      });
  }

   actualizarCantidad(item: any) {
    this.cartService.addToCart(item);
    this.total=this.cartService.getTotal();
   /*  this.noti.mensaje('Orden',
    'Cantidad actualizada: '+item.cantidad,
    TipoMessage.info) */
  }

  eliminarItem(item: any) {
    this.cartService.removeFromCart(item);
    this.total=this.cartService.getTotal();
    this.noti.mensaje('Orden',
    'Producto eliminado',
    TipoMessage.warning)
  }

  checkout(){
    this.router.navigate(['/orden/checkout'],
    {
      relativeTo:this.route
    })
  }

  registrarOrden(tarjeta, direccion) {
    if(this.cartService.getItems!=null){
      //Obtener los items del carrito de compras
      let itemsCarrito=this.cartService.getItems;
      //Armar la estructura de la tabla intermedia
      //[{'videojuegoId':valor, 'cantidad':valor}]
      let detalles=itemsCarrito.map(
        x=>({
          ['idProducto']:x.idItem,
          ['cantidad']: x.cantidad
        })
      )
      detalles.forEach((element) => {
        console.log(element)
        this.gService.updateProductoCantidad('producto/cantidad',element)
        .subscribe((respuesta:any)=>{
        })
      });
      //Datos para el API
      let infoFact={
        'usuario': this.currentUser.user.id,
        'direccion': direccion,
        'tarjeta': tarjeta,
        'createdAt': new Date(this.fecha),
        'productos':detalles,
        'total': this.total,
      }
      this.gService.create('factura',infoFact)
      .subscribe((respuesta:any)=>{
        this.noti.mensaje('Factura',
        'Factura registrada #'+respuesta.id,
        TipoMessage.success)
        this.cartService.deleteCart();
        this.total=this.cartService.getTotal();
        this.router.navigate(['/'])
      })
    }else{
     this.noti.mensaje('Factura',
     'Agregue productos a la orden',
     TipoMessage.warning)
    }
  }
}

