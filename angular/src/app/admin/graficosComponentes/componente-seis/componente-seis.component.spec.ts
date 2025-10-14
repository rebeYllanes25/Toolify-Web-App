import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteSeisComponent } from './componente-seis.component';

describe('ComponenteSeisComponent', () => {
  let component: ComponenteSeisComponent;
  let fixture: ComponentFixture<ComponenteSeisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteSeisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteSeisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
