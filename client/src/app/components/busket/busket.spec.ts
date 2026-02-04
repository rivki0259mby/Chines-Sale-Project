import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Busket } from './busket';

describe('Busket', () => {
  let component: Busket;
  let fixture: ComponentFixture<Busket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Busket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Busket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
