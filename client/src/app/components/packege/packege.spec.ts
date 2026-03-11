import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Packege } from './packege';

describe('Packege', () => {
  let component: Packege;
  let fixture: ComponentFixture<Packege>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Packege]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Packege);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
