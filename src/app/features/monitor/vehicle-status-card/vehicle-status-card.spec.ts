import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleStatusCard } from './vehicle-status-card';

describe('VehicleStatusCard', () => {
  let component: VehicleStatusCard;
  let fixture: ComponentFixture<VehicleStatusCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleStatusCard],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleStatusCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
