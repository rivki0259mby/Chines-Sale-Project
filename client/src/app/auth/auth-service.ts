import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BASE_URL = 'https://localhost:7280/api/Auth';
  BASE_URL_USER = 'https://localhost:7280/api/User';

  constructor(private http: HttpClient) { }

  register(body: any) {
    console.log("im in login service");
    return this.http.post(`${this.BASE_URL}/register`, body);
  }

  login(body: any) {


    return this.http.post<any>(`${this.BASE_URL}/login`, body).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user)); 
        }
      })
    );
  }
  get user() {
  return JSON.parse(localStorage.getItem('user') || '{}');
}

  loguot() {

    localStorage.removeItem('token');
    localStorage.removeItem('user')
  }

  get token() {
    return localStorage.getItem('token');

  }


  isLoggedIn() {
    return !!this.token;
  }
  
  isAdmin():boolean{
    const user = this.user;
    return user && user.role ==='Admin'

  }

  getUserById(id:string){
    return this.http.get(`${this.BASE_URL_USER}/${id}`);
  }

}
