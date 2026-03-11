import { busketModel } from "./busket.model"
import { packageModel } from "./package.model"

export class purchasePackagesModel {
    purchaseId?: number
    purchase?:busketModel
    packageId?: number
    package?:packageModel
    quantity?: number
}