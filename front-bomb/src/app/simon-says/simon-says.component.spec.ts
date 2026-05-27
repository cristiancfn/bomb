import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimonSaysComponent } from './simon-says.component';

describe('SimonSaysComponent', () => {
  let component: SimonSaysComponent;
  let fixture: ComponentFixture<SimonSaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimonSaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimonSaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
