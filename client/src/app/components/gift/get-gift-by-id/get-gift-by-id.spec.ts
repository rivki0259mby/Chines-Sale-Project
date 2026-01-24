import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetGiftById } from './get-gift-by-id';

describe('GetGiftById', () => {
  let component: GetGiftById;
  let fixture: ComponentFixture<GetGiftById>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetGiftById]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetGiftById);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
