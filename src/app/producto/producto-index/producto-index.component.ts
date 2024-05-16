import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from 'src/app/share/cart.service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

interface Images {
  url: string;
}

@Component({
  selector: 'app-producto-index',
  templateUrl: './producto-index.component.html',
  styleUrls: ['./producto-index.component.css']
})
export class ProductoIndexComponent {
  datos:any;//Respuesta del API
  destroy$:Subject<boolean>=new Subject<boolean>();
  public imgSrc:string = "assets/images/1.webp";
  idUsuario:any;
  n:any;
  images: Images[] = [];
  past:any;
  isCliente:boolean;
  isVendedor:boolean;
  isAdmin:boolean;
  currentUser:any;
  categoriasList: any;

  filterDatos:any;

  text:any = -1;
  categoria:any = -1;
  precio:any = -1;

  constructor(private gService:GenericService,
    private dialog:MatDialog,
    private router:Router,
    private route:ActivatedRoute,
    private httpClient:HttpClient,
    private cartService:CartService,
    private notificacion: NotificacionService,
    private auth:AuthenticationService
    ){
    this.listaProductos(); 
    this.listaCategorias();
    let id=this.route.snapshot.paramMap.get('id');
    if(!isNaN(Number(id))){
      this.idUsuario = Number(id);
    } else {
      this.idUsuario = 0;
    }
    this.auth.currentUser.subscribe((x)=>(this.currentUser=x));
    
    this.auth.currentUser.subscribe((x)=>{
      if(this.currentUser!=null){
        this.isCliente = x.user.tiposUsuario.some(element => element.tipoUsuario === 'CLIENTE')
        this.isVendedor = x.user.tiposUsuario.some(element => element.tipoUsuario === 'VENDEDOR')
        this.isAdmin = x.user.tiposUsuario.some(element => element.tipoUsuario === 'ADMIN')
      }
    });
    //localhost:3000/videojuego

        this.getImages()
      

  }

  ngOnInit(): void {
    this.mensajes();
  }

  mensajes() {
   let register=false;
   let auth='';
   //Obtener parámetros de la URL
   this.route.queryParams.subscribe((params)=>{
    auth=params['auth'] || '';
    if(auth){
      this.notificacion.mensaje(
        'Usuario',
        'Acceso denegado',
        TipoMessage.warning
      )
    }
   })
   
  }
  
  listaProductos(){
    this.gService.list('producto/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.datos=data;
        this.filterDatos=this.datos;
      });
  }

  listaCategorias() {
    this.categoriasList = null;
    this.gService
      .list('categoria')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.categoriasList = data; 
      });
  }

  applyFilters(text:any, categoria:any, precio:any){
    this.text=text;
    this.categoria=categoria;
    this.precio=precio;
    this.filterDatos=this.datos
    if(this.text){
      this.filterDatos=this.filterDatos.filter(
        producto=> 
          producto?.nombre.toLowerCase().includes(this.text.toLowerCase())
      )
    }
    if (this.categoria > 0) {
      this.filterDatos = this.filterDatos.filter(
        (producto) => producto?.idCategoria == this.categoria
      );
    }
    if (this.precio == 1) {
      this.filterDatos = this.filterDatos.sort((a, b) => a.id - b.id);
    } else if (this.precio == 2) {
      this.filterDatos = this.filterDatos.sort((a, b) => a.precio -b.precio);
    } else {
      this.filterDatos = this.filterDatos.sort((a, b) => b.precio - a.precio);
    }
  }

  detalle(id:number){
    this.router.navigate(['/producto',id],
    {
      relativeTo:this.route
    })
  }
  update(){
    this.router.navigate(['/producto/all/', this.currentUser.user.id],
    {
      relativeTo:this.route
    })
  }
  create(){
    this.router.navigate(['/producto/create'],
    {
      relativeTo:this.route
    })
  }

  getImages(){
    this.gService.list('images/all')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.images=data;
      });
  }

  comprar(id:number){
    this.gService
    .get('producto',id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
      //Agregar videojuego obtenido del API al carrito
      this.cartService.addToCart(data);
      //Notificar al usuario
      this.notificacion.mensaje(
        'Orden',
        'Producto: '+data.nombre+ ' agregado a la orden',
        TipoMessage.success
      )
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true); 
    this.destroy$.unsubscribe();
  }
}
