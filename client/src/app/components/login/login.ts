import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

    constructor(private router:Router){}
    authService: AuthService = inject(AuthService);
    profileForm = new FormGroup({
    Username : new FormControl(''),
    Password : new FormControl(''),
  });

  login(){
    console.log("im in login");
    this.authService.login(this.profileForm.value).subscribe();
    console.log("succes",this.profileForm.value);
    

  }
  logout(){
    this.authService.loguot();
    
  }
}
