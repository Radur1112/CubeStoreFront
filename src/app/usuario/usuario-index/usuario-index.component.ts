import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-usuario-index',
  templateUrl: './usuario-index.component.html',
  styleUrls: ['./usuario-index.component.css']
})
export class UsuarioIndexComponent implements OnInit {
   
  constructor(
    private router: Router, 
    private route: ActivatedRoute) {
  

  }

  ngOnInit(): void {
    this.router.navigate(['/usuario/login'], { relativeTo: this.route });
  }
}