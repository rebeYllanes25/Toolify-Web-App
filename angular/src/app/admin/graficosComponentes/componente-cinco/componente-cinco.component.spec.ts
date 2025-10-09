import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteCincoComponent } from './componente-cinco.component';

describe('ComponenteCincoComponent', () => {
  let component: ComponenteCincoComponent;
  let fixture: ComponentFixture<ComponenteCincoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteCincoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteCincoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
