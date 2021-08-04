import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../service/token.service';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { JwtDto } from '../modeloAcceso/jwt-dto';
import { catchError, concatMap } from 'rxjs/operators';
const AUTHORIZATION = 'Authorization';
@Injectable({
  providedIn: 'root'
})
export class ProdInterceptorService implements HttpInterceptor {
  constructor(private tokenService: TokenService,
              private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si no estoy loggeado
    if (!this.tokenService.isLogged()) {
      return next.handle(req);
    }
    let intReq = req;
    const token = this.tokenService.getToken();// El token
    intReq = this.addToken(req, token);
    return next.handle(intReq).pipe(catchError((err: HttpErrorResponse) => {
      // Si el status es 401 el token esta caducado
      if (err.status === 401) {
        const dto: JwtDto = new JwtDto(this.tokenService.getToken());// un dto para enviarlo al servidor y se le pasa el token que esta almacenado en el local storage
        return this.authService.refresh(dto).pipe(concatMap((data: any) => { // pipe para que los observables se ejecuten en orden
          console.log('refreshing....');
          this.tokenService.setToken(data.token);// Se almacena el token
          intReq = this.addToken(req, data.token);
          return next.handle(intReq);
        }));
      } else {
        this.tokenService.logOut();
        return throwError(err);// Lanzamos el error
      }
    }));
  }
  // Metodo
  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
  }
}
export const interceptorProvider = [{ provide: HTTP_INTERCEPTORS, useClass: ProdInterceptorService, multi: true }];