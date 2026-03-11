import { CategoryModel } from "./category.model";
import { donorModel } from "./donor.model";
import { ticketModel } from "./ticket.model";
import { winnerModel } from "./Winner.model";

export class giftModel{
    id?:number;
    name?:string;
    description?:string;
    price?:number;
    imageUrl?:string;
    categoryId?:number;
    category?:CategoryModel
    donorId?:string;
    donor?:donorModel
    winnerId?:string;
    winner?:winnerModel;
    isDrown?:boolean;
    tickets?:ticketModel[] 

}