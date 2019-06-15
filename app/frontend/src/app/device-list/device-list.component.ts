import { Component, OnInit } from '@angular/core';
import {DeviceService} from '../_services/device.service';
import {Device} from '../_models/device';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  devices: Device[];

  constructor(private deviceService: DeviceService) { }

  ngOnInit() {
    this.deviceService.readDevices().subscribe(devices => {
      console.log(`Got ${devices}`);
      this.devices = devices;
    });
  }

}
