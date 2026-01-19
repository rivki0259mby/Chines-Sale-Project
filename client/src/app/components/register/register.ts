import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  authService: AuthService = inject(AuthService);

  profileForm = new FormGroup({
    Id : new FormControl(''),
    FullName : new FormControl(''),
    UserName : new FormControl(''),
    Password : new FormControl(''),
    Email : new FormControl(''),
    PhoneNumber : new FormControl(''),
  });

  register(){
    console.log("im in register");
    
    this.authService.register(this.profileForm.value).subscribe();
    console.log("succes",this.profileForm.value);
    
  }
}
