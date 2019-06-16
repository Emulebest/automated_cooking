import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSetTemperatureComponent } from './device-set-temperature.component';

describe('DeviceSetTemperatureComponent', () => {
  let component: DeviceSetTemperatureComponent;
  let fixture: ComponentFixture<DeviceSetTemperatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSetTemperatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSetTemperatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
