import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// NG-ZORRO - אותם אימפורטים כמו ברגיסטר
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { BusketService } from '../../service/busket';
import { busketModel } from '../../models/busket.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class PaymentComponent {
  busketSrv = inject(BusketService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  basketId = this.route.snapshot.paramMap.get('basketId');
  isLoading = false;
  success = false;
  submitted = false;

  payment = {
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  // לוגיקת בדיקות תקינות (נשארת זהה)
  get isCardHolderValid() { return this.payment.cardHolder.trim().length >= 2; }
  get isCardNumberValid() { return /^\d{16}$/.test(this.payment.cardNumber.replace(/\s/g, '')); }
  get isExpiryValid() { return /^(0[1-9]|1[0-2])\/\d{2}$/.test(this.payment.expiry); }
  get isCvvValid() { return /^\d{3}$/.test(this.payment.cvv); }

  get isFormValid() {
    return this.isCardHolderValid && this.isCardNumberValid && this.isExpiryValid && this.isCvvValid;
  }

  pay() {
    this.submitted = true;
    if (!this.isFormValid) return;

    this.isLoading = true;
    this.busketSrv.getById(Number(this.basketId)).subscribe(b => {
      this.busketSrv.completePurchase(b.id!, b).subscribe(() => {
        this.isLoading = false;
        this.success = true;
        // אופציונלי: ניווט לדף תודה אחרי 2 שניות
        setTimeout(() => this.router.navigate(['/']), 2000);
      });
    });
  }
}
