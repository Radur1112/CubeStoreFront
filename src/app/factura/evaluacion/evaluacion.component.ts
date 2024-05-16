import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css']
})
export class EvaluacionComponent {
  destroy$:Subject<boolean>=new Subject<boolean>();
  evaluacionForm: FormGroup;
  
  estrellas: number[] = [1, 2, 3, 4, 5];
  puntuacion: number = 0;
  hoveredIndex: number = -1;

  constructor(private router:Router,
    private fb: FormBuilder,
    private noti: NotificacionService,
    private route:ActivatedRoute,
    private gService:GenericService,
    public dialogRef: MatDialogRef<EvaluacionComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any
  ) {
    this.evaluacionForm = this.fb.group({
      mensaje: [null, null]
    });

    console.log(datos);
  }

  hover(index: number): void {
    this.hoveredIndex = index;
  }

  leave(): void {
    this.hoveredIndex = -1;
  }

  puntuar(index: number): void {
    this.puntuacion = index + 1;
  }

  evaluar(){
    let evaluacion = {
      ['idUsuarioEvaluador']: this.datos.idUsuarioEvaluador,
      ['idUsuarioEvaluado']: this.datos.idUsuarioEvaluado,
      ['idFactura']: this.datos.idFactura,
      ['calificacion']: this.puntuacion,
      ['mensaje']: this.evaluacionForm.value.mensaje,
      ['evaluador']: this.datos.evaluador,
    }

    this.gService.create('evaluacion',evaluacion)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {

      this.noti.mensaje('Evaluación',
      'Usuario evaluado',
      TipoMessage.success)
      //Obtener respuesta
      this.dialogRef.close();
      this.router.navigate(['/factura/all/'+this.datos.idUsuarioEvaluador]);
    });
  }

  submitForm() {
    if (this.evaluacionForm.valid) {
      // Process the form data
      console.log(this.evaluacionForm.value);
      this.dialogRef.close();
    }
  }
}