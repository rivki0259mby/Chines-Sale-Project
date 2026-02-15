import { purchasePackagesModel } from "./PurchasePackages.model"
import { ticketModel } from "./ticket.model"
import { winnerModel } from "./Winner.model"

export class busketModel {
    id?: number
    buyerId?: string
    buyer?: winnerModel
    totalAmount?: number
    orderDate?: Date
    isDraft?: boolean
    purchasePackages?: purchasePackagesModel[]
    tickets?: ticketModel[]
}