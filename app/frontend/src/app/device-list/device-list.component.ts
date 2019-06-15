import {Component, OnInit} from '@angular/core';
import {DeviceService} from '../_services/device.service';
import {Device} from '../_models/device';
import {NotificationService} from '../_services/notification.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  devices: Device[];

  constructor(private deviceService: DeviceService, private notificationService: NotificationService) {

  }

  ngOnInit() {
    this.deviceService.newDeviceCreated.subscribe(device => {
      console.log(device);
      this.devices.push(device);
      console.log(this.devices);
    });
    this.deviceService.readDevices().subscribe(devices => {
      this.devices = devices;
    });
    this.notificationService.messages.subscribe(msg => {
      console.log(msg);
      const foundDevice: Device | undefined = this.devices.find((dv, index, array) => {
        return dv.id === msg.device;
      });
      if (foundDevice) {
        switch (msg.type) {
          case 'show_temp':
            foundDevice.temp = msg.temp;
            break;
          case 'connected':
            foundDevice.connected = true;
            break;
          default:
            break;
        }
      }
    });
  }

}
