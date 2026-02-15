import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// NG-ZORRO Imports
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoading = signal(false);
  showError = signal(false);

  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8) // ולידציה ל-8 תווים כפי שביקשת
    ]),
  });

  login() {
    // עצירה ושירות הודעות שגיאה אם הטופס לא תקין
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return; // מונע שליחה לשרת
    }

    this.isLoading.set(true);
    this.showError.set(false);

    this.authService.login(this.loginForm.value).subscribe({
      next: (user: any) => {
        this.isLoading.set(false);
        if (user) {
          this.router.navigate(['/']);
        } else {
          this.showError.set(true);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.showError.set(true);
      }
    });
  }
}
