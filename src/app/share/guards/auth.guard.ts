import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subject, elementAt, takeUntil } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { GenericService } from 'src/app/share/generic.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  datos:any;//Respuesta del API
  destroy$:Subject<boolean>=new Subject<boolean>();
  isAuthenticated:boolean;
  currentUser: any;
  constructor(private gService:GenericService,
    private authService:AuthenticationService, 
    private router: Router) {
      //Subscribirse para obtener si esta autenticado
      this.authService.isAuthenticated.subscribe(
        (valor) => (this.isAuthenticated = valor)
      );
      //Subscribirse para obtener el usuario autenticado
      this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let url: string = state.url;
      return this.checkUserLogin(route, url);
      
  }
  //Verificar que el rol del usuario coincida
  //con alguno de los indicados
  async checkUserLogin(route: ActivatedRouteSnapshot, url: any): Promise<boolean> {
    if (this.isAuthenticated) {
      const tipos = [];
      const userTiposUsuario = this.currentUser.user.tiposUsuario;
      userTiposUsuario.forEach(element => {
        tipos.push(element.tipoUsuario);
      });

      if(route.data['direccion']){
        const data = await this.gService.list('direccion/usuario/' + this.currentUser.user.id)
        .pipe(takeUntil(this.destroy$))
        .toPromise();

        this.datos = data;
          
        if(this.datos.length > 0){
          if(tipos.length == 1 && tipos.includes('VENDEDOR')){
            this.router.navigate(['/direccion/'], {
              //Parametro para mostrar mensaje en login
              queryParams: { auth: 'no' }
            });
            return false;
          }
        }
      }

      if(route.data['vefiryId']){
        if(route.params['id'] != this.currentUser.user.id){
          this.router.navigate(['/producto/'], {
            //Parametro para mostrar mensaje en login
            queryParams: { auth: 'no' }
          });
          return false;
        }
      }
      
      if(!route.data['tipoUsuarios'].some(element => tipos.includes(element))){
        this.router.navigate(['/producto/'], {
          //Parametro para mostrar mensaje en login
          queryParams: { auth: 'no' }
        });
        return false;
      } else {
        return true;
      }
    } 
    this.router.navigate(['/producto'], {
      queryParams: { auth: 'no'}
    });
    return false;
  }
}