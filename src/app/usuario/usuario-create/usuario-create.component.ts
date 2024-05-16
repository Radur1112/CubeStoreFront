import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GenericService } from 'src/app/share/generic.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificacionService } from 'src/app/share/notification.service';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-usuario-create',
  templateUrl: './usuario-create.component.html',
  styleUrls: ['./usuario-create.component.css']
})
export class UsuarioCreateComponent implements OnInit {
  hide = true;
  usuario: any;
  tipos: any;
  formCreate: FormGroup;
  makeSubmit: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private authService: AuthenticationService
  ) {
    this.reactiveForm();
  }

  reactiveForm() {
    this.formCreate = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      clave: ['', [Validators.required]],
      tiposUsuario: ['', [Validators.required]],
    });
    this.getTipos();
  }
  ngOnInit(): void {}
  submitForm() {
    this.makeSubmit=true;
    //Validación
    if(this.formCreate.invalid){
     return;
    }
    console.log("jiji")
    this.authService.createUser(this.formCreate.value)
    .subscribe((respuesta:any)=>{
      this.usuario=respuesta;
      this.router.navigate(['/usuario/login'],{
        //Mostrar un mensaje
        queryParams:{register:'true'},
      })
    })
  }
  onReset() {
    this.formCreate.reset();
  }
  getTipos() {
    this.gService
      .list('tipoUsuario')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.tipos = data;
        console.log( this.tipos);
      });
  }
  public errorHandling = (control: string, error: string) => {
    return (
      this.formCreate.controls[control].hasError(error) &&
      this.formCreate.controls[control].invalid &&
      (this.makeSubmit || this.formCreate.controls[control].touched)
    );
  };
}

