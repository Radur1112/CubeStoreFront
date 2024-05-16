import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';

interface UploadedImage {
  url: string;
}

@Component({
  selector: 'app-producto-detail',
  templateUrl: './producto-detail.component.html',
  styleUrls: ['./producto-detail.component.css']
})
export class ProductoDetailComponent {
  datos:any;
  destroy$:Subject<boolean>=new Subject<boolean>();

  idProducto: number = 0;

  currentUser: any;

  preguntaForm: FormGroup;
  respuestaForm: FormGroup;
  resp: any;
  id:any;
  uploadedImages: UploadedImage[] = [];

  isCliente: boolean;
  isVendedor: boolean;

  constructor( 
    private fb: FormBuilder,
    private gService: GenericService,
    private route:ActivatedRoute,
    private router: Router,
    private auth:AuthenticationService,
    private httpClient:HttpClient
    ){
      this.id=this.route.snapshot.paramMap.get('id');
      if(!isNaN(Number(this.id))){
        this.obtenerProducto(Number(this.id));
        this.fetchUploadedImages(Number(this.id));
      }

      this.formularioReactive();
  }
  ngOnInit(): void {
    //Verificar si se envio un id por parametro para crear formulario para actualizar
    this.route.params.subscribe((params:Params)=>{
      this.idProducto=params['id'];
      if(this.idProducto!=undefined){
        this.auth.currentUser.subscribe((x)=>(this.currentUser=x));
        let id=this.route.snapshot.paramMap.get('id');
        this.auth.currentUser.subscribe((x)=>{
          if(this.currentUser!=null){
            this.isCliente = x.user.tiposUsuario.some(element => element.tipoUsuario === 'CLIENTE')
          }
        });
        console.log(this.currentUser.user.id);
          //Establecer los valores en cada una de las entradas del formulario
          this.preguntaForm.setValue({
            idUsuario:this.currentUser.user.id,
            idProducto:this.idProducto,
            descripcion:""
          });
          this.respuestaForm.setValue({
            idUsuario:this.currentUser.user.id,
            idPregunta:0,
            descripcion:""
          });
        }
    });
  }
  
  obtenerProducto(id:any){
    this.gService
    .get('producto',id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
      console.log(data);
        this.datos=data;
        this.isVendedor = this.currentUser.user.tiposUsuario.some(element => element.tipoUsuario === 'VENDEDOR') && this.currentUser.user.id == this.datos.idUsuario
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

//Crear Formulario
formularioReactive() {
  //[null, Validators.required]
  this.preguntaForm = this.fb.group({
    idUsuario: [null, null],
    idProducto: [null, null],
    descripcion: [null, Validators.required]
  })
  this.respuestaForm = this.fb.group({
    idUsuario: [null, null],
    idPregunta: [null, null],
    descripcion: [null, Validators.required]
  })
}

public errorHandlingPregunta = (control: string, error: string) => {
  return this.preguntaForm.controls[control].hasError(error);
};
public errorHandlingRespuesta = (control: string, error: string) => {
  return this.respuestaForm.controls[control].hasError(error);
};

enviarPregunta(): void {
  //Accion API create enviando toda la informacion del formulario
  if(this.preguntaForm.invalid){
    return;
  }
  this.gService.create('pregunta',this.preguntaForm.value)
  .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
    //Obtener respuesta
    this.resp=data;
  });
  this.obtenerProducto(this.id);
  this.preguntaForm.reset();
  this.respuestaForm.reset();
}
enviarRespuesta(idPregunta:Number): void {
  //Accion API create enviando toda la informacion del formulario
  if(this.respuestaForm.invalid){
    return;
  }
  this.respuestaForm.value.idPregunta = idPregunta;
  console.log(this.respuestaForm.value);
  this.gService.create('respuesta',this.respuestaForm.value)
  .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
    //Obtener respuesta
    this.resp=data;
  });
  this.obtenerProducto(this.id);
  this.preguntaForm.reset();
  this.respuestaForm.reset();
}

  fetchUploadedImages(id:any) {
    this.gService.list('images/all')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.uploadedImages = data[id];
      });
  }
}

