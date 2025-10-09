import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesactivarProductoComponent } from './desactivar-producto.component';

describe('DesactivarProductoComponent', () => {
  let component: DesactivarProductoComponent;
  let fixture: ComponentFixture<DesactivarProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesactivarProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesactivarProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
