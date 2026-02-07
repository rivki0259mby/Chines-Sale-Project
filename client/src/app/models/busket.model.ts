import { purchasePackagesModel } from "./PurchasePackages.model"
import { ticketModel } from "./ticket.model"

export class busketModel {
    id?: number
    buyerId?: string
    totalAmount?: number
    orderDate?: Date
    isDraft?: boolean
    purchasePackages?: purchasePackagesModel[]
    tickets?: ticketModel[]
}