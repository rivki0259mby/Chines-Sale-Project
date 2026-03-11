import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// NG-ZORRO Imports - אלו המודולים שחסרים לך
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true, // קומפוננטה עצמאית
  imports: [
    CommonModule, // חובה עבור *ngFor ו-directives בסיסיים
    NzButtonModule, // עבור הכפתורים (nz-button)
    NzGridModule, // עבור מערכת הגריד (nz-row, nz-col)
    NzCardModule, // עבור הכרטיסיות (nz-card)
    NzIconModule // עבור האייקונים (nz-icon)
    ,
    RouterLink
],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  featuredPackages = [
    { name: 'חבילת ארד', price: 180, tickets: 10 },
    { name: 'חבילת כסף', price: 360, tickets: 25 },
    { name: 'חבילת זהב', price: 500, tickets: 45 },
    { name: 'חבילת פלטינה', price: 1000, tickets: 100 }
  ];

  scrollToSteps() {
    const el = document.getElementById('steps');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
