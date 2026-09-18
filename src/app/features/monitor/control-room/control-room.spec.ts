import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlRoom } from './control-room';

describe('ControlRoom', () => {
  let component: ControlRoom;
  let fixture: ComponentFixture<ControlRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlRoom],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlRoom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
