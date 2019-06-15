import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../_services/notification.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

  // constructor(private notificationService: NotificationService) {
  //   this.notificationService.messages.subscribe(msg => {
  //
  //   });
  // }
  constructor() {}

  ngOnInit() {
  }

}
