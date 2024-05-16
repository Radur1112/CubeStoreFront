import { Component, ChangeDetectorRef  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApiProvinciasService } from 'src/app/share/api-provincias.service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-tarjeta-form',
  templateUrl: './tarjeta-form.component.html',
  styleUrls: ['./tarjeta-form.component.css']
})
export class TarjetaFormComponent {
  destroy$: Subject<boolean> = new Subject<boolean>();
  //Titulo
  titleForm: string = 'Crear';
  
  //producto a actualizar
  tarjetaInfo: any;
  //Respuesta del API crear/modificar
  respTarjeta: any;
  //Sí es submit
  submitted = false;
  //Nombre del formulario
  tarjetaForm: FormGroup;
  //id del Videojuego
  idTarjeta: number = 0;
  //Sí es crear
  isCreate: boolean = true;

  selectedDate: Date = new Date();

  currentUser: any;

  tiposEnumValues = Object.values(tiposEnum);

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private api:ApiProvinciasService,
    private router: Router,
    private activeRouter: ActivatedRoute, 
    private auth:AuthenticationService
  ) {
    this.formularioReactive();
  }

  ngOnInit(): void {
    this.auth.currentUser.subscribe((x)=>(this.currentUser=x));
    //Verificar si se envio un id por parametro para crear formulario para actualizar
    this.activeRouter.params.subscribe((params:Params)=>{
      this.idTarjeta=params['id'];
      if(this.idTarjeta!=undefined){
        this.isCreate=false;
        this.titleForm="Actualizar";
        //Obtener direccion a actualizar del API
        this.gService.get('tarjeta',this.idTarjeta).pipe(takeUntil(this.destroy$))
          .subscribe(async (data:any)=>{
          this.tarjetaInfo=data;
          const inputDate = new Date(this.tarjetaInfo.fechaExp);
          const year = inputDate.getFullYear();
          const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
          const day = inputDate.getDate().toString().padStart(2, '0');
          const formattedDateString = `${year}-${month}-${day}`;
          //Establecer los valores en cada una de las entradas del formulario
          console.log(this.tarjetaInfo.id)
          this.tarjetaForm.setValue({
            id:this.tarjetaInfo.id,
            idUsuario:parseInt(this.currentUser.user.id),
            tipo:this.tarjetaInfo.tipo,
            proveedor:this.tarjetaInfo.proveedor,
            nombre:this.tarjetaInfo.nombre,
            numero:this.tarjetaInfo.numero,
            fechaExp:formattedDateString
          })
        });
      }
    });
  }

  //Crear Formulario
  formularioReactive() {
    //[null, Validators.required]
    this.tarjetaForm=this.fb.group({
      id:[null,null],
      idUsuario: [null, null],
      tipo: [null, Validators.required],
      proveedor: [null, Validators.required],
      nombre:[null, Validators.required],
      numero: [null, Validators.compose([
        Validators.required,
        Validators.pattern(/^\d{16}$/)
      ])],
      fechaExp: [null, Validators.required],
    })
  }

  public errorHandling = (control: string, error: string) => {
    return this.tarjetaForm.controls[control].hasError(error);
  };

  //Crear
  crearTarjeta(): void {
    //Establecer submit verdadero
    this.submitted = true;
    //Verificar validación
    if(this.tarjetaForm.invalid){
      return;
    }
    //Accion API create enviando toda la informacion del formulario
    this.tarjetaForm.value.idUsuario = this.currentUser.user.id; 
    const fecha = new Date(this.selectedDate);
    this.tarjetaForm.value.fechaExp = fecha; 
    this.gService.create('tarjeta',this.tarjetaForm.value)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
      //Obtener respuesta
      this.respTarjeta=data;
      this.router.navigate(['/tarjeta'],{
        queryParams: {create:'true'}
      });
    });
  }

  //Actualizar
  actualizarTarjeta() {
    //Establecer submit verdadero
    this.submitted=true;
    //Verificar validación
    if(this.tarjetaForm.invalid){
      return;
    }
    //Accion API create enviando toda la informacion del formulario
    this.tarjetaForm.value.idUsuario = this.currentUser.user.id; 
    const fecha = new Date(this.selectedDate);
    this.tarjetaForm.value.fechaExp = fecha; 
    this.gService.update('tarjeta',this.tarjetaForm.value)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
      //Obtener respuesta
      this.respTarjeta=data;
      this.router.navigate(['/tarjeta'],{
        queryParams: {update:'true'}
      });
    });
  }

  onReset() {
    this.submitted = false;
    this.tarjetaForm.reset();
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

enum tiposEnum {
  CREDITO= 'CREDITO',
  DEBITO='DEBITO',
}
