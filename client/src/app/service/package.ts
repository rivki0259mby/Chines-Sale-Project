
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { packageModel } from '../models/package.model';

@Injectable({
  providedIn: 'root',
})
export class PackageService {

  BASE_URL = 'https://localhost:7280/api/Package';

  http:HttpClient = inject(HttpClient);
  constructor(){}

  getAll():Observable<packageModel[]>{
    return this.http.get<packageModel[]>(this.BASE_URL);
  }

  getById(id:number):Observable<packageModel>{
    return this.http.get<packageModel>(this.BASE_URL+ '/' +id);
  }

  add(item:packageModel):Observable<packageModel>{
    return this.http.post<packageModel>(this.BASE_URL,item);
  } 

  update(id:number,item:packageModel):Observable<packageModel>{
    return this.http.put<packageModel>(this.BASE_URL + `/${id}`,item);
  } 

  delete(id:number){
    return this.http.delete(this.BASE_URL + `/${id}`)
  }

  sortBy( sortBy?: string ):Observable<packageModel[]>{
    let params = new HttpParams();
    if(sortBy) params = params.set('sortBy',sortBy);
    return this.http.get<packageModel[]>(this.BASE_URL + `/sortBy`,{params});
  }









  
}
