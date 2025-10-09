import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteCuatroComponent } from './componente-cuatro.component';

describe('ComponenteCuatroComponent', () => {
  let component: ComponenteCuatroComponent;
  let fixture: ComponentFixture<ComponenteCuatroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteCuatroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteCuatroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
