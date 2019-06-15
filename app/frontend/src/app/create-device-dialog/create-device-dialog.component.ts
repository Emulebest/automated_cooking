import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DeviceService} from '../_services/device.service';
import {AlertService} from '../_services/alert.service';
import {Device} from '../_models/device';

@Component({
  selector: 'app-create-device-dialog',
  templateUrl: './create-device-dialog.component.html',
  styleUrls: ['./create-device-dialog.component.scss']
})
export class CreateDeviceDialogComponent implements OnInit {

  newDevice: FormGroup;
  submitted = false;
  savedDevice: Device;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateDeviceDialogComponent>,
    private deviceService: DeviceService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.newDevice = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.newDevice.invalid) {
      return;
    }

    this.deviceService.createDevice(this.newDevice.controls.description.value)
      .pipe(first())
      .subscribe(
        data => {
          this.savedDevice = data;
          this.dialogRef.close(this.savedDevice);
        },
        error => {
          this.alertService.error(error);
        });
  }

  ngOnInit() {
  }

}
