import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {DeviceService} from '../_services/device.service';
import {AlertService} from '../_services/alert.service';
import {NotificationService} from '../_services/notification.service';

@Component({
  selector: 'app-device-set-temperature',
  templateUrl: './device-set-temperature.component.html',
  styleUrls: ['./device-set-temperature.component.scss']
})
export class DeviceSetTemperatureComponent implements OnInit {

  deviceParams: FormGroup;
  submitted = false;
  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DeviceSetTemperatureComponent>,
    private deviceService: DeviceService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService
  ) {
    this.deviceParams = this.formBuilder.group({
      targetTemp: ['', Validators.required],
      timer: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.deviceParams.invalid) {
      return;
    }

    this.notificationService.sendMsg({
      type: 'set_temp',
      device: this.data.device,
      temp: Number(this.deviceParams.controls.targetTemp.value)
    });

    this.deviceService.setTime(this.data.device, Number(this.deviceParams.controls.timer.value)).subscribe(data => {
    }, error => this.alertService.error(error));
    this.dialogRef.close({
      targetTemp: Number(this.deviceParams.controls.targetTemp.value),
      timer: Number(this.deviceParams.controls.timer.value)
    });
  }

  ngOnInit() {
  }

}
