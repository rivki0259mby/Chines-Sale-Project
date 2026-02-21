import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { giftModel } from '../models/Gift.model';

@Injectable({
  providedIn: 'root',
})
export class GiftService {

  BASE_URL = 'http://localhost:5065/api/Gift';

  http:HttpClient = inject(HttpClient);
  constructor(){}

  getAll():Observable<giftModel[]>{
    return this.http.get<giftModel[]>(this.BASE_URL);
  }

  getById(id:number):Observable<giftModel>{
    return this.http.get<giftModel>(this.BASE_URL+ '/' +id);
  }

  add(item:giftModel):Observable<giftModel>{
    return this.http.post<giftModel>(this.BASE_URL,item);
  }

  update(id:number,item:any):Observable<giftModel>{
    return this.http.put<giftModel>(this.BASE_URL + `/${id}`,item);
  }

  delete(id:number){
    return this.http.delete(this.BASE_URL + `/${id}`)
  }

  filter(name?:string,donorId?:string,buyerCount?:number,categoryId?:number):Observable<giftModel[]>{ 
     let params = new HttpParams();
     if (name) params = params.set('name', name);
     if (donorId) params = params.set('donorId', donorId);
     if (buyerCount !== undefined && buyerCount!==null) params = params.set('buyerCount', buyerCount.toString());
     if (categoryId !== undefined && categoryId!==null) params = params.set('categoryId', categoryId.toString());
     return this.http.get<giftModel[]>(this.BASE_URL+'/FilterGifts', { params } );
  }

  lottery(gift:giftModel):Observable<giftModel>{
    return this.http.put<giftModel>(this.BASE_URL + `/Lottery`,gift.id);
  }
    
   
  
  
}
