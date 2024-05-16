import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-usuario-login',
  templateUrl: './usuario-login.component.html',
  styleUrls: ['./usuario-login.component.css']
})
export class UsuarioLoginComponent implements OnInit {
  hide=true;
  formulario: FormGroup;
  makeSubmit: boolean = false;
  infoUsuario: any;
  x: any;
  constructor(
    public fb: FormBuilder,
    private authService: AuthenticationService,
    private notificacion: NotificacionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reactiveForm();
  }
  // Definir el formulario con su reglas de validación
  reactiveForm() {
    this.formulario = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.mensajes();
  }

  mensajes() {
   let register=false;
   let auth='';
   //Obtener parámetros de la URL
   this.route.queryParams.subscribe((params)=>{
    register=params['register']==='true' || false;
    auth=params['auth'] || '';
    console.log(auth)
    if(register){
      this.notificacion.mensaje(
        'Usuario',
        'Usuario registrado! Especifique sus credenciales',
        TipoMessage.success
      )
    }
    if(auth){
      this.notificacion.mensaje(
        'Usuario',
        'Acceso denegado',
        TipoMessage.warning
      )
    }
   })
  }
  
  onReset() {
    this.formulario.reset();
  }
  submitForm() {
    this.makeSubmit=true;
    //Validación
    if(this.formulario.invalid){
     return;
    }
    const hola = this.authService.loginUser(this.formulario.value)
    .subscribe((respuesta:any)=>{
      const tipousuario=respuesta.data.user.tiposUsuario[0].tipoUsuario;
      console.log(respuesta)
      if(tipousuario=='VENDEDOR'){
        this.router.navigate(['/dashboard/vendedor']);
      } else if (tipousuario == 'ADMIN') {
        this.router.navigate(['/dashboard/admin']);
      } else {
        // Handle other tipousuarios cases or provide a default route
        this.router.navigate(['/']);
      }
      // if(respuesta.data..some(element => element.tipoUsuario === 'CLIENTE')){

      // }

    })
  }
  /* Manejar errores de formulario en Angular */

  public errorHandling = (control: string, error: string) => {
    return (
      this.formulario.controls[control].hasError(error) &&
      this.formulario.controls[control].invalid &&
      (this.makeSubmit || this.formulario.controls[control].touched)
    );
  };
}
