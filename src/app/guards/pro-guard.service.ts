/* import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '../service/token.service';

@Injectable({
  providedIn: 'root'
})
export class ProdGuardService implements CanActivate {

  realRol: string;// Rol real user o admin

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRol = route.data.expectedRol;// Rol esperado
    this.realRol = this.tokenService.isAdmin() ? 'admin' : 'user';
    // Si no hay token o si tenemos ud token no esperado o el valor realRol no esta en el array
    if (!this.tokenService.isLogged || expectedRol.indexOf(this.realRol) < 0) {
      this.router.navigate(['/']);// no accede al recurso
      return false;
    }
    return true;
  }
}  */