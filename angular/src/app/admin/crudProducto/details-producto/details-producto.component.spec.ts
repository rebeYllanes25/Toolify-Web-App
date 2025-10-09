import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProductoComponent } from './details-producto.component';

describe('DetailsProductoComponent', () => {
  let component: DetailsProductoComponent;
  let fixture: ComponentFixture<DetailsProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
