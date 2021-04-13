import { Component, OnInit } from '@angular/core';
import { TokenService } from '../service/token.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public esAdmin: boolean   
  public esPropietario: boolean;

  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    this.esAdmin = this.tokenService.isAdmin();  // Se calcula si es admin
    this.esPropietario = this.tokenService.esPropietario();
  }
}
