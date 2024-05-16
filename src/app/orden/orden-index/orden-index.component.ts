import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CartService, ItemCart } from 'src/app/share/cart.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { UsuarioCreateComponent } from 'src/app/usuario/usuario-create/usuario-create.component';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-orden-index',
  templateUrl: './orden-index.component.html',
  styleUrls: ['./orden-index.component.css']
})
export class OrdenIndexComponent implements OnInit{
  subtotal = 0;
  total = 0;
  fecha = Date.now();
  qtyItems = 0;
  currentUser:any;

  displayedColumns: string[] = ['producto', 'precio', 'cantidad', 'subtotal','acciones'];
  dataSource = new MatTableDataSource<any>();
  constructor(
    private cartService: CartService,
    private noti: NotificacionService,
    private gService: GenericService,
    private router: Router,
    private route:ActivatedRoute,
    private auth:AuthenticationService
  ) {

    this.auth.currentUser.subscribe((x)=>(this.currentUser=x));
  }

  ngOnInit(): void {
    this.cartService.currentDataCart$.subscribe(data=>{
     this.dataSource=new MatTableDataSource(data)
    })
    this.subtotal=this.cartService.getSubTotal()
    this.total=this.cartService.getTotal()
   }
  
   actualizarCantidad(item: any) {
    this.cartService.addToCart(item);
    this.subtotal=this.cartService.getSubTotal()
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
    TipoMessage.warning);
    this.subtotal=this.cartService.getSubTotal()
    this.total=this.cartService.getTotal();
  }

  checkout(){
    this.router.navigate(['/orden/checkout'],
    {
      relativeTo:this.route
    })
  }
}
