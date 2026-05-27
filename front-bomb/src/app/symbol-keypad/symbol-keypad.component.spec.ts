import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolKeypadComponent } from './symbol-keypad.component';

describe('SymbolKeypadComponent', () => {
  let component: SymbolKeypadComponent;
  let fixture: ComponentFixture<SymbolKeypadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymbolKeypadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymbolKeypadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
