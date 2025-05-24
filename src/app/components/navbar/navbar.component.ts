import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  constructor(location: Location,  private element: ElementRef, private router: Router) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = [
      { path: '/dashboard', title: 'DASHBOARD' },
      { path: '/productos', title: 'PRODUCTOS' },
      { path: '/empleados', title: 'COLABORADORES' },
      { path: '/user-profile', title: 'PERFIL DE USUARIO' },
      { path: '/tables', title: 'TABLAS' },
      { path: '/icons', title: 'ICONOS' },
      { path: '/maps', title: 'MAPAS' },
      { path: '/conductores', title: 'CONDUCTORES' },
      { path: '/enviosProductos', title: 'ENVIOS' },
      { path: '/historialProductos', title: 'HISTORIAL DE PRODUCTOS' },
      { path: '/rutas', title: 'RUTAS' },
      { path: '/vehiculos', title: 'VEHICULOS' }
      
    ];
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
  }

}
