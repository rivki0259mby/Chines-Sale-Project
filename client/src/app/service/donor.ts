import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { donorModel } from '../models/donor.model';
import { Observable } from 'rxjs';
import { CategoryModel } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class DonorSevice {

    BASE_URL = 'http://localhost:5065/api/Donor';

    http: HttpClient = inject(HttpClient);
    constructor(){}

    getAll():Observable<donorModel[]>{
      return this.http.get<donorModel[]>(this.BASE_URL);
    }

    getById(id:string):Observable<donorModel>{
      return this.http.get<donorModel>(this.BASE_URL+ '/' +id);
    }
    add(donor:donorModel):Observable<donorModel>{

      return this.http.post<donorModel>(this.BASE_URL,donor);
    }

    update(id:string,item:donorModel):Observable<donorModel>{
      console.log("update"+item);
      
      return this.http.put<donorModel>(this.BASE_URL + `/${id}`,item);
    }

    delete(id:string){
      return this.http.delete(this.BASE_URL + `/${id}`)
    }

    filter(name?:string,email?:string,giftId?:number):Observable<donorModel[]>{
     
      let params = new HttpParams();
      if (name) params = params.set('name', name);
     
      if (email) params = params.set('email', email);
      alert(params.toString());
      if (giftId !== undefined && giftId!==null) params = params.set('giftId', giftId.toString());
      alert(params.toString());
      return this.http.get<donorModel[]>(this.BASE_URL+'/filter', { params } );
    }

  }




  

