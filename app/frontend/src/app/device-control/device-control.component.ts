import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {CreateDeviceDialogComponent} from '../create-device-dialog/create-device-dialog.component';
import {DeviceService} from '../_services/device.service';

@Component({
  selector: 'app-device-control',
  templateUrl: './device-control.component.html',
  styleUrls: ['./device-control.component.scss']
})
export class DeviceControlComponent implements OnInit {

  constructor(public dialog: MatDialog, private deviceService: DeviceService) {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateDeviceDialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.deviceService.inputNewDevice(result);
    });
  }

  ngOnInit() {
  }

}
