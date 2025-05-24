import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare interface RouteInfo {
    path?: string;
    title: string;
    icon: string;
    class: string;
    children?: RouteInfo[];
    isCollapsed?: boolean;
}

export const ROUTES: RouteInfo[] = [
    { 
        title: 'Inicio',  
        icon: 'tv-2 text-primary',
        class: '',
        isCollapsed: true,
        children: [
            { 
                path: '/dashboard', 
                title: 'Dashboard', 
                icon: 'shop text-primary', 
                class: '' 
            }
        ]
    },
    { 
        title: 'Productos',  
        icon: 'bag-17 text-primary',
        class: '',
        isCollapsed: true,
        children: [
            { 
                path: '/productos', 
                title: 'Registrar Productos', 
                icon: 'ni-collection text-primary', 
                class: '' 
            },
            { 
                path: '/historialProductos', 
                title: 'Historial de Productos', 
                icon: 'ni-align-left-2 text-primary', 
                class: '' 
            },
            { 
                path: '/enviosProductos', 
                title: 'Envios', 
                icon: 'ni-delivery-fast text-primary', 
                class: '' 
            }
        ]
    },
    { 
        title: 'Trabajadores',  
        icon: 'single-02 text-primary',
        class: '',
        isCollapsed: true,
        children: [
            { 
                path: '/empleados', 
                title: 'Colaboradores',  
                icon: 'ni-circle-08 text-primary', 
                class: '' 
            },
            { 
                path: '/conductores', 
                title: 'Conductores',  
                icon: 'ni-paper-diploma text-primary', 
                class: '' 
            },
            { 
                path: '/rutas', 
                title: 'Rutas',  
                icon: 'ni-map-big text-primary', 
                class: '' 
            },
            { 
                path: '/vehiculos', 
                title: 'Vehiculos',  
                icon: 'ni-bus-front-12 text-primary', 
                class: '' 
            }
        ]
    }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    public menuItems: RouteInfo[];
    public isCollapsed = true;
    public activeTitle = 'Dashboard';

    constructor(private router: Router) {}

    ngOnInit() {
        this.menuItems = ROUTES.map(item => ({ 
            ...item, 
            isCollapsed: true 
        }));
        this.setupRouterEvents();
        this.updateActiveTitle(this.router.url);
    }

    toggleCollapse(item: RouteInfo): void {
        if (item.children) {
            // Cierra todos los demás primero
            this.menuItems.forEach(i => {
                if (i !== item && i.children) i.isCollapsed = true;
            });
            // Alterna el estado del actual
            item.isCollapsed = !item.isCollapsed;
        }
    }

    setActiveTitle(title: string): void {
        this.activeTitle = title;
    }

    private closeAllCollapses(): void {
        this.menuItems.forEach(item => {
            if (item.children) item.isCollapsed = true;
        });
    }

    private setupRouterEvents(): void {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.closeAllCollapses();
            this.updateActiveTitle(event.urlAfterRedirects);
        });
    }

    private updateActiveTitle(currentRoute: string): void {
        for (const menuItem of this.menuItems) {
            if (menuItem.children) {
                const found = menuItem.children.find(child => 
                    currentRoute.includes(child.path)
                );
                if (found) {
                    this.activeTitle = found.title;
                    break;
                }
            }
        }
    }
}