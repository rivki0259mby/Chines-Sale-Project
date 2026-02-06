import { purchasePackagesModel } from "./PurchasePackages.model"

export class busketModel {
    id?: number
    buyerId?: string
    totalAmount?: number
    orderDate?: Date
    isDraft?: boolean
    PurchasePackages?: purchasePackagesModel[]
}