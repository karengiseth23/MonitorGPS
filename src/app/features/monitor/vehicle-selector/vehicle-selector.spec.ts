import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleSelector } from './vehicle-selector';

describe('VehicleSelector', () => {
  let component: VehicleSelector;
  let fixture: ComponentFixture<VehicleSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
