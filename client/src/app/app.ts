import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Busket } from "./components/busket/busket";
import { AuthService } from './auth/auth-service';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge'; // הוספנו
import { NzDrawerModule } from 'ng-zorro-antd/drawer'; // הוספנו

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLinkActive, RouterOutlet, CommonModule, RouterLink, RouterModule,
    NzIconModule, NzMenuModule, NzLayoutModule, NzButtonModule, NzBadgeModule,
    NzDrawerModule, Busket
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
  authSrv: AuthService = inject(AuthService);
 
  // משתנה לשליטה על פתיחת הסל
  isBasketVisible = false;

  navItems = [
    {label:'הזוכים',routerLink:['winners'],role:'admin'},
    { label: 'תורמים', routerLink: ['donors'],role:'admin' },
    { label: 'הפרסים', routerLink: ['category'] ,role:'all'},
    { label: 'החבילות', routerLink: ['package'],role:'all' },
    { label: ' בית', routerLink: [''] ,role:'all'},
  ];

  get fuilterNavItems(){
    const checkAdmin = this.authSrv.isAdmin()
    return this.navItems.filter(item=>{
      if(item.role === 'all') return true;
      if(item.role ==='admin') return checkAdmin;
      return false
    })
  }

  // פונקציה לפתיחת/סגירת הסל
  toggleBasket(): void {
    this.isBasketVisible = !this.isBasketVisible;
  }
}
