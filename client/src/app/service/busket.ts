import { HttpClient } from '@angular/common/http';
import { EventEmitter, inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { busketModel } from '../models/busket.model';
import { packageModel } from '../models/package.model';
import { ticketModel } from '../models/ticket.model';
import { giftModel } from '../models/Gift.model';

@Injectable({
  providedIn: 'root',
})
export class BusketService {

  BASE_URL = 'https://localhost:7280/api/Purchase'

  http: HttpClient = inject(HttpClient);
  public busketUpdate :EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  getAll(): Observable<busketModel[]> {
    return this.http.get<busketModel[]>(this.BASE_URL);
  }

  getById(id: number): Observable<busketModel> {
    return this.http.get<busketModel>(this.BASE_URL + '/' + id);
  }

  // add(item:busketModel):Observable<busketModel>{
  //   return this.http.post<busketModel>(this.BASE_URL,item);
  // } 

  update(id: number, item: busketModel): Observable<busketModel> {
    return this.http.put<busketModel>(this.BASE_URL + `/${id}`, item);
  }

  // delete(id:number){
  //   return this.http.delete(this.BASE_URL + `/${id}`)
  // }


  getByUserId(userId: string): Observable<busketModel> {


    return this.http.get<busketModel>(this.BASE_URL + `/getByUserId/${userId}`)


  }

  addPackage(purchaseId: number, packageId: number): Observable<busketModel> {
    console.log(purchaseId, packageId);
    return this.http.post<busketModel>(this.BASE_URL + `/AddPackage/${purchaseId}/${packageId}`,{}).pipe(
      tap(() => this.busketUpdate.emit())
    )
  }

  deletePackage(busketId: number, packageId: number): Observable<busketModel> {
    return this.http.delete<busketModel>(this.BASE_URL + `/deletePackage/${busketId}/${packageId}`).pipe(
      tap(() => this.busketUpdate.emit())
    )
  }

  addTicket(item: ticketModel): Observable<busketModel> {
    return this.http.post<busketModel>(this.BASE_URL + `/AddTicket`, item).pipe(
      tap(() => this.busketUpdate.emit())
    )
  }

  deleteTicket(purchaseId: number, ticketId: number): Observable<busketModel> {
    return this.http.delete<busketModel>(this.BASE_URL + `/deleteTicket/${purchaseId}/${ticketId}`).pipe(
      tap(() => this.busketUpdate.emit())
    )
  }

  completePurchase(purchaseId: number,purchase:busketModel): Observable<busketModel> {
    return this.http.post<busketModel>(this.BASE_URL + `/completePurchase/${purchaseId}`,purchase)
  }

}
