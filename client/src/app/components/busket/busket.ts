import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BusketService } from '../../service/busket';
import { busketModel } from '../../models/busket.model';
import { packageModel } from '../../models/package.model';
import { ticketModel } from '../../models/ticket.model';
import { Counter } from "../counter/counter";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-busket',
  imports: [FormsModule, CommonModule, CardModule, ButtonModule],
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
      console.log(this.basket.tickets);
    })

  }
  get groupTickets() :any[]{
    if (!this.basket || !this.basket.tickets) return [];

    const gruops = this.basket.tickets.reduce((acc: any, ticket: ticketModel) => {
      const id = ticket.giftId || 'unknown';
      if (!acc[id]) {
        acc[id] = { ...ticket, totalTickets: 0 }
      }
      acc[id].totalTickets++;
      return acc;
    }, {});
    return Object.values(gruops);
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

addGift(giftId : number){
    const ticket = {
      giftId: giftId,
      purchaseId: this.basket.id,
      quantity:1
      
    }
    
    return this.basketSrv.addTicket(ticket).subscribe((updateBusket:busketModel)=>{
      this.basket = updateBusket;
    });
  }
  deleteGift(ticketId:number){
    return this.basketSrv.deleteTicket(this.basket.id!,ticketId).subscribe((updateBusket:busketModel)=>{
      this.basket = updateBusket;
    });
  }
 get totalPurchasedTickets(): number {
  if (!this.basket || !this.basket.purchasePackages) return 0;
 
  return this.basket.purchasePackages.reduce((sum, pp) => {
    // pp.package הוא אובייקט החבילה המחובר ל-PurchasePackage
    // pp.quantity הוא מספר הפעמים שהחבילה הזו נקנתה
    const ticketsInPackage = pp.package?.quentity || 0;
    return sum + ((pp.quantity ||0 )* ticketsInPackage);
  }, 0);
}

// 2. סך הכרטיסים שכבר נוצלו (המתנות שנבחרו ברכישה הזו)
get usedTickets(): number {
  if (!this.basket || !this.basket.tickets) return 0;
  // אלו הם הכרטיסים שמשויכים ל-PurchaseId הנוכחי
  return this.basket.tickets.length;
}

// 3. היתרה למימוש
get remainingTickets(): number {
  const remaining = this.totalPurchasedTickets - this.usedTickets;
  return remaining > 0 ? remaining : 0;
}




}
