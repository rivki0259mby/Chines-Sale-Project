import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BusketService } from '../../service/busket';
import { busketModel } from '../../models/busket.model';
import { packageModel } from '../../models/package.model';
import { ticketModel } from '../../models/ticket.model';
import { Counter } from "../counter/counter";

@Component({
  selector: 'app-busket',
  imports: [CardModule, ButtonModule],
  templateUrl: './busket.html',
  styleUrl: './busket.css',
})
export class Busket {

  basketSrv: BusketService = inject(BusketService)

  basket: busketModel = {}
  user: any = {}

  ngOnInit() {
    this.user = localStorage.getItem('user')
    if (this.user) {
      this.user = JSON.parse(this.user)
      this.getByUserId(this.user.id)
    }
  }

  getByUserId(userId: string) {
    this.basketSrv.getByUserId(userId).subscribe(b => {
      this.basket = b
      console.log(this.basket);
    })

  }
  // addPackage(item:packageModel){
  //   return this.basketSrv.addPackage(this.basket.id!,item).subscribe()
  // }
  // deletePackage(packageId:number){
  //   return this.basketSrv.deletePackage(this.basket.id!,packageId).subscribe()
  // }
  // addTicket(item:ticketModel){
  //   return this.basketSrv.addTicket(item).subscribe();
  // }
  
  // deleteTicket(ticketId:number){
  //   return this.basketSrv.deleteTicket(this.basket.id!,ticketId).subscribe()
  // }



  


}
