import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tpv } from './tpv';

describe('Tpv', () => {
  let component: Tpv;
  let fixture: ComponentFixture<Tpv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tpv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tpv);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
