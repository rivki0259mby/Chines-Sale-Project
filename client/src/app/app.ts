import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Busket } from "./components/busket/busket";
import { AuthService } from './auth/auth-service';


@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule, Busket],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
  authSrv : AuthService = inject(AuthService)
  
  navItems = [
    { label: 'החבילות', routerLink: ['package'],role:'all' },
    { label: 'הפרסים', routerLink: ['category'] ,role:'all'},
    { label: 'תורמים', routerLink: ['donors'],role:'admin' },
    { label: 'דברו איתנו', routerLink: [''] ,role:'all'},
    { label: 'חדשות אחרונות', routerLink: [''] ,role:'all'}
  ];

  get fuilterNavItems(){
    const checkAdmin = this.authSrv.isAdmin()
    return this.navItems.filter(item=>{
      if(item.role === 'all') return true;
      if(item.role ==='admin') return checkAdmin;
      return false
    })
  }
}
