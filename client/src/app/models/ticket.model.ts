import { busketModel } from "./busket.model";
import { giftModel } from "./Gift.model";

export class ticketModel{
    id?:number;
    giftId?:number;
    gift?:giftModel;
    purchaseId?:number;
    purchase?:busketModel;
    quantity?:number = 1;
    totalTickets?:number;
}