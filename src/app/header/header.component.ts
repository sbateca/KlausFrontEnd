/* import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccesoService } from '../acceso/acceso.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private accesoService: AccesoService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.accesoService.isUserLoggedIn();
    console.log('menu ->' + this.isLoggedIn);
  }
  handleLogout() {
    this.accesoService.logout();
  }

}
 */

import { Component, OnInit } from '@angular/core';
import { TokenService } from '../service/token.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogged = false;
  constructor(private tokenService: TokenService) { }
  ngOnInit() {
    this.isLogged = this.tokenService.isLogged();
  }
  onLogOut(): void {
    this.tokenService.logOut();
  }
}