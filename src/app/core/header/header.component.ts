import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { CartService } from 'src/app/share/cart.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isAutenticated: boolean;
  isCliente:boolean;
  isVendedor:boolean;
  isAdmin:boolean;
  currentUser: any;
  qtyItems:Number = 0;
  constructor(private cartService: CartService,
    private router: Router,
    private authService: AuthenticationService) {  
      this.qtyItems=this.cartService.quantityItems()    
  }

  ngOnInit(): void {
     //Subscripción a la información del usuario actual
    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));
     //Subscripción al boolean que indica si esta autenticado
     this.authService.isAuthenticated.subscribe((valor)=>(this.isAutenticated=valor));
     
    this.authService.currentUser.subscribe((x)=>{
      if(this.currentUser!=null){
        this.isCliente = x.user.tiposUsuario.some(element => element.tipoUsuario === 'CLIENTE')
        this.isVendedor = x.user.tiposUsuario.some(element => element.tipoUsuario === 'VENDEDOR')
        this.isAdmin = x.user.tiposUsuario.some(element => element.tipoUsuario === 'ADMIN')
      }
    });
     this.cartService.countItems.subscribe((value)=>{
      this.qtyItems=value
     })
  }
  pedido(){
    this.router.navigate(['pedido/'+this.currentUser.user.id]);
  }

  historial(){
    this.router.navigate(['factura/all/'+this.currentUser.user.id]);
  }
  login(){
    this.router.navigate(['usuario/login']);
  }
  logout(){
    this.authService.logout();
    this.router.navigate(['usuario/login']);
  }
  
}
