import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteTresComponent } from './componente-tres.component';

describe('ComponenteTresComponent', () => {
  let component: ComponenteTresComponent;
  let fixture: ComponentFixture<ComponenteTresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteTresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
