import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, DividerModule, ButtonModule, InputTextModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {


    constructor(private router:Router){}
    authService: AuthService = inject(AuthService);
    showUserNotFound = signal(false)
    profileForm = new FormGroup({
    Username : new FormControl(''),
    Password : new FormControl(''),
  });

  login(){
    console.log("im in login");
    this.authService.login(this.profileForm.value).subscribe({
      next:(user:any) =>{
        if(user){
          this.router.navigate(['/'])
        }
        else{
          this.showUserNotFound.set(true)
        }
      },
      error:(err:any)=>{
        this.showUserNotFound.set(true)
      }
      
   
    });
    console.log("succes",this.profileForm.value);
    

  }
  logout(){
    this.authService.loguot();
    
  }
}
