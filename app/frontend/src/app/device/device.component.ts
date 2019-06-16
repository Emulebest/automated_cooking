import {Component, Input, OnInit} from '@angular/core';
import {Device} from '../_models/device';
import {MatDialog} from '@angular/material';
import {DeviceSetTemperatureComponent} from '../device-set-temperature/device-set-temperature.component';
import {AlertService} from '../_services/alert.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

  @Input() device: Device;

  constructor(public dialog: MatDialog, private alertService: AlertService) {
  }

  get timer() {
    if (this.device.timestamp) {
      const created = new Date(this.device.timestamp);
      return new Date(created.getTime() + this.device.time * 60000).getTime();
    }
    return;
  }

  onCompleted() {
    this.device.time = undefined;
    this.device.timestamp = undefined;
    this.device.targetTemp = undefined;
    this.device.status = 'off';
    this.alertService.success('Cooking finished successfully!');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeviceSetTemperatureComponent, {
      width: '250px',
      data: {device: this.device.id, temp: this.device.temp}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.device.timestamp = result.currentTime;
        this.device.targetTemp = result.targetTemp;
        this.device.time = result.timer;
        this.device.status = "on";
      }
    });
  }

  ngOnInit() {
  }

}
