import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { GenericService } from 'src/app/share/generic.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/share/authentication.service';

interface UploadedImage {
  url: string;
}

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  //Titulo
  titleForm: string = 'Crear';
  //Lista de atributos
  atributosList: any;
  categoriasList: any;
  //producto a actualizar
  productoInfo: any;
  //Respuesta del API crear/modificar
  respProducto: any;
  //Sí es submit
  submitted = false;
  //Nombre del formulario
  productoForm: FormGroup;
  //id del Videojuego
  idProducto: number = 0;
  //Sí es crear
  isCreate: boolean = true;
  
  multipleImages = [];

  uploadedImages: UploadedImage[] = [];

  estadoEnumValues = Object.values(estadosEnum);

  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private httpClient:HttpClient,
    private auth:AuthenticationService
  ) {
    this.formularioReactive();
    this.listaAtributos();
    this.listaCategorias();
  }

  ngOnInit(): void {
    this.auth.currentUser.subscribe((x)=>(this.currentUser=x));
    //Verificar si se envio un id por parametro para crear formulario para actualizar
    this.activeRouter.params.subscribe((params:Params)=>{
      this.idProducto=params['id'];
      if(this.idProducto!=undefined){
        this.isCreate=false;
        this.titleForm="Actualizar";
         //Obtener videojuego a actualizar del API
         this.gService.get('producto',this.idProducto).pipe(takeUntil(this.destroy$))
         .subscribe((data:any)=>{
          this.productoInfo=data;
          //Establecer los valores en cada una de las entradas del formulario
          this.productoForm.setValue({
            id:this.productoInfo.id,
            idUsuario:parseInt(this.currentUser.user.id),
            idCategoria:this.productoInfo.idCategoria,
            nombre:this.productoInfo.nombre,
            descripcion:this.productoInfo.descripcion,
            precio:this.productoInfo.precio,
            cantidad:this.productoInfo.cantidad,
            estado:this.productoInfo.estado,
            atributos:this.productoInfo.atributos.map(({id}) => id)
          })
          this.fetchUploadedImages(this.productoInfo.id);
         });
      }

    });
  }

  //Crear Formulario
  formularioReactive() {
    //[null, Validators.required]
    this.productoForm=this.fb.group({
      id:[null,null],
      idUsuario: [null, null],
      idCategoria: [null, Validators.required],
      nombre:[null, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      descripcion: [null, Validators.required],
      precio: [null, Validators.required],
      cantidad: [null, Validators.required],
      estado: [null, Validators.required],
      atributos: [null, Validators.required],
    })
  }

  listaAtributos() {
    this.atributosList = null;
    this.gService
      .list('atributo')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // console.log(data);
        this.atributosList = data; 
      });
  }

  listaCategorias() {
    this.categoriasList = null;
    this.gService
      .list('categoria')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // console.log(data);
        this.categoriasList = data; 
      });
  }
  
  public errorHandling = (control: string, error: string) => {
    return this.productoForm.controls[control].hasError(error);
  };

  //Crear Videojueogo
  crearProducto(): void {
    //Establecer submit verdadero
    this.submitted = true;
    //Verificar validación
    if(this.productoForm.invalid){
      return;
    }
    //Obtener id Generos del Formulario y Crear arreglo con {id: value}
    let gFormat:any=this.productoForm.get('atributos').value.map(x=>({['id']: x}))
    //Asignar valor al formulario
    this.productoForm.patchValue({atributos: gFormat});
    //Accion API create enviando toda la informacion del formulario
    this.productoForm.value.idUsuario = this.currentUser.user.id; 
    this.gService.create('producto',this.productoForm.value)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
      //Obtener respuesta
      this.respProducto=data;
      this.router.navigate(['/producto'],{
        queryParams: {create:'true'}
      });
    });
    console.log(this.productoForm.value.idUsuario);
    this.gService.list('producto/') 
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
      if (data && Array.isArray(data)) {
        this.onMultipleSubmit(data[data.length-1].id+1);
      }
    });
  }

  //Actualizar Videojuego
  actualizarProducto() {
    //Establecer submit verdadero
    this.submitted=true;
    //Verificar validación
    if(this.productoForm.invalid){
      return;
    }
    
    this.productoForm.value.idUsuario = this.currentUser.user.id; 
    //Obtener id Generos del Formulario y Crear arreglo con {id: value}
    let gFormat:any=this.productoForm.get('atributos').value.map(x=>({['id']: x }));
    //Asignar valor al formulario 
    this.productoForm.patchValue({ atributos:gFormat});

     // Get the selected category object from the categoriasList based on the selected idCategoria
    const selectedCategoriaId = this.productoForm.get('idCategoria').value;
    const selectedCategoria = this.categoriasList.find((categoria: any) => categoria.id === selectedCategoriaId);
    
    // Set the 'descripcion' of the selected category to the 'idCategoria' field in the form
    this.productoForm.patchValue({ idCategoria: selectedCategoria.descripcion });

    //Accion API create enviando toda la informacion del formulario
    this.gService.update('producto',this.productoForm.value)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
      //Obtener respuesta
      this.respProducto=data;
      this.router.navigate(['/producto'],{
        queryParams: {update:'true'}
      });
    });
    
    this.onMultipleSubmit(this.productoForm.value.id);
  }

  onReset() {
    this.submitted = false;
    this.productoForm.reset();
  }
  onBack() {
    this.router.navigate(['/producto']);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }


  uploadMultiple(event: any) {
    this.multipleImages = event.target.files;
  }
  
  onMultipleSubmit(id:any){
    if(this.multipleImages.length > 0){
      const formData = new FormData();
      for(let img of this.multipleImages){
        formData.append('files', img);
      }
      this.httpClient.post<any>(`http://localhost:3000/multiplefiles/${id}`, formData).subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );
    }
  }
  
  fetchUploadedImages(id:any) {
    this.gService.list('images/all')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.uploadedImages = data[id];
      });
  }
}

enum estadosEnum {
  NUEVO= 'NUEVO',
  USADO_COMO_NUEVO='USADO_COMO_NUEVO',
  USADO_BUEN_ESTADO='USADO_BUEN_ESTADO',
  USADO_ACEPTABLE='USADO_ACEPTABLE',
}