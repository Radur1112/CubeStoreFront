import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApiProvinciasService } from 'src/app/share/api-provincias.service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-direccion-form',
  templateUrl: './direccion-form.component.html',
  styleUrls: ['./direccion-form.component.css']
})
export class DireccionFormComponent {
  destroy$: Subject<boolean> = new Subject<boolean>();
  //Titulo
  titleForm: string = 'Crear';
  
  provinciaList: any;
  cantonList: any;
  distritoList: any;
  //producto a actualizar
  direccionInfo: any;
  //Respuesta del API crear/modificar
  respDireccion: any;
  //Sí es submit
  submitted = false;
  //Nombre del formulario
  direccionForm: FormGroup;
  //id del Videojuego
  idDireccion: number = 0;
  //Sí es crear
  isCreate: boolean = true;

  currentUser: any;

  selectedProvincia:any;
  selectedCanton:any;
  selectedDistrito:any;
  selectedCodigo:any;

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private api:ApiProvinciasService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private auth:AuthenticationService
  ) {
    this.formularioReactive();
    this.listaProvincias();
  }

  ngOnInit(): void {
    this.auth.currentUser.subscribe((x)=>(this.currentUser=x));
    //Verificar si se envio un id por parametro para crear formulario para actualizar
    this.activeRouter.params.subscribe((params:Params)=>{
      this.idDireccion=params['id'];
      if(this.idDireccion!=undefined){
        this.isCreate=false;
        this.titleForm="Actualizar";
        //Obtener direccion a actualizar del API
        this.gService.get('direccion',this.idDireccion).pipe(takeUntil(this.destroy$))
          .subscribe(async (data:any)=>{
          this.direccionInfo=data;
          
          const foundProvincia = this.provinciaList.find(item => item.value === this.direccionInfo.provincia);
          this.selectedProvincia = foundProvincia;

          await this.listaCantones(foundProvincia);
          const foundCanton = this.cantonList.find(item => item.value === this.direccionInfo.canton);
          this.selectedCanton = foundCanton;
          
          await this.listaDistritos(foundCanton);
          const foundDistrito = this.distritoList.find(item => item.value === this.direccionInfo.distrito);
          this.selectedDistrito = foundDistrito;
          //Establecer los valores en cada una de las entradas del formulario
          this.direccionForm.setValue({
            id:this.direccionInfo.id,
            idUsuario:parseInt(this.currentUser.user.id),
            provincia:foundProvincia,
            canton:foundCanton,
            distrito:foundDistrito,
            direccionExacta:this.direccionInfo.direccionExacta,
            codigoPostal:this.direccionInfo.codigoPostal,
            telefono:this.direccionInfo.telefono
          })
        });
      }
    });
  }

  //Crear Formulario
  formularioReactive() {
    //[null, Validators.required]
    this.direccionForm=this.fb.group({
      id:[null,null],
      idUsuario: [null, null],
      provincia: [null, Validators.required],
      canton: [null, Validators.required],
      distrito: [null, Validators.required],
      direccionExacta:[null, Validators.required],
      codigoPostal: [null, Validators.required],
      telefono: [null, Validators.compose([
        Validators.required,
        Validators.pattern(/^\d{8}$/)
      ])],
    })
  }

  listaProvincias() {
    this.api.getProvincias()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
      this.provinciaList = Object.keys(data).map(key => ({ key, value: data[key] }));
    });
  }

  listaCantones(provincia:any) {
    let prov;
    return new Promise<void>((resolve, reject) => {
      if(provincia.source == undefined){
        prov = provincia
      } else {
        prov = provincia.value
      }
      if (prov !== undefined) {
        this.selectedCanton = undefined;
        this.selectedDistrito = undefined;
        this.selectedCodigo = undefined;
        this.api.getCantones(prov.key)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (data: any) => {
              this.cantonList = Object.keys(data).map(key => ({ key, value: data[key] }));
              resolve(); // Resolve the promise when the operation is complete
            },
            error => {
              reject(error); // Reject the promise if there's an error
            }
          );
      } else {
        resolve(); // Resolve immediately if provincia is undefined
      }
    });
  }

  listaDistritos(canton: any): Promise<void> {
    let cant;
    return new Promise<void>((resolve, reject) => {
      if(canton.source == undefined){
        cant = canton
      } else {
        cant = canton.value
      }
      if (this.selectedProvincia !== undefined && cant !== undefined) {
        this.selectedDistrito = undefined;
        this.selectedCodigo = undefined;
        this.api.getDistritos(this.selectedProvincia.key, cant.key)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (data: any) => {
              this.distritoList = Object.keys(data).map(key => ({ key, value: data[key] }));
              resolve(); // Resolve the promise when the operation is complete
            },
            error => {
              reject(error); // Reject the promise if there's an error
            }
          );
      } else {
        resolve(); // Resolve immediately if either provincia or canton is undefined
      }
    });
  }

  createCodigo(distrito:any) {
    let dist;
    if(distrito.source == undefined){
      dist = distrito
    } else {
      dist = distrito.value
    }
    if(this.selectedProvincia !== undefined && this.selectedCanton !== undefined && dist !== undefined){
      this.selectedCodigo = this.selectedProvincia.key + "0" + this.selectedCanton.key + "0" + dist.key;
    }
  }
  public errorHandling = (control: string, error: string) => {
    return this.direccionForm.controls[control].hasError(error);
  };

  //Crear
  crearDireccion(): void {
    //Establecer submit verdadero
    this.submitted = true;
    //Verificar validación
    if(this.direccionForm.invalid){
      return;
    }
    //Accion API create enviando toda la informacion del formulario
    this.direccionForm.value.idUsuario = this.currentUser.user.id; 
    this.gService.create('direccion',this.direccionForm.value)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
      //Obtener respuesta
      this.respDireccion=data;
      this.router.navigate(['/direccion'],{
        queryParams: {create:'true'}
      });
    });
  }

  //Actualizar
  actualizarDireccion() {
    //Establecer submit verdadero
    this.submitted=true;
    //Verificar validación
    if(this.direccionForm.invalid){
      return;
    }
    //Accion API create enviando toda la informacion del formulario
    this.direccionForm.value.idUsuario = this.currentUser.user.id; 
    this.gService.update('direccion',this.direccionForm.value)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
      //Obtener respuesta
      this.respDireccion=data;
      this.router.navigate(['/direccion'],{
        queryParams: {update:'true'}
      });
    });
  }

  onReset() {
    this.submitted = false;
    this.direccionForm.reset();
  }
  onBack() {
    this.router.navigate(['/producto']);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }

}
