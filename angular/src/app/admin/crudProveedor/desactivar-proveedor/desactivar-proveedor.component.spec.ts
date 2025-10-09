import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesactivarProveedorComponent } from './desactivar-proveedor.component';

describe('DesactivarProveedorComponent', () => {
  let component: DesactivarProveedorComponent;
  let fixture: ComponentFixture<DesactivarProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesactivarProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesactivarProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
