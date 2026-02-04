import { Component, inject } from '@angular/core';
import { GiftService } from '../../../service/gift';
import { giftModel } from '../../../models/Gift.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-get-gift-by-id',
  imports: [],
  templateUrl: './get-gift-by-id.html',
  styleUrl: './get-gift-by-id.css',
})
export class GetGiftById {
    private route = inject(ActivatedRoute);
    giftSrv: GiftService = inject(GiftService);
    drafgift :giftModel = {};
    giftId!:number ;
    ngOnInit(){
      this.giftId = Number(this.route.snapshot.paramMap.get('id'));
            this.getById();

    }

    getById(){
     this.giftSrv.getById(this.giftId).subscribe(gift =>{
        this.drafgift = gift;
     }
    );
    }
  
}
