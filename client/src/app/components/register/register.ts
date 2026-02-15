import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// NG-ZORRO Imports
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authService = inject(AuthService);
  router = inject(Router);
  isLoading = signal(false);

  profileForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9}$')]), // בדיקת ת.ז 9 ספרות
    fullName: new FormControl('', [Validators.required]),
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
  });

  register() {
    if (this.profileForm.invalid) {
      Object.values(this.profileForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    this.isLoading.set(true);
    this.authService.register(this.profileForm.value).subscribe({
      next: (user: any) => {
        this.isLoading.set(false);
        if (user) {
          this.router.navigate(['/login']);
        }
      },
      error: (err: any) => {
        this.isLoading.set(false);
        console.error("err", err);
      }
    });
  }
}
