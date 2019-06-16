import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Device} from '../_models/device';
import {environment} from '../../environments/environment';
import {Observable, Subject} from 'rxjs';
import {first} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  newDeviceCreated: Subject<Device> = new Subject<Device>();

  constructor(private http: HttpClient) {

  }

  createDevice(description: string): Observable<Device> {
    return this.http.post<Device>(`${environment.deviceUrl}/devices/`, {
      description
    }).pipe(first());
  }

  readDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${environment.deviceUrl}/devices/`).pipe(first());
  }

  inputNewDevice(device: Device) {
    this.newDeviceCreated.next(device);
  }

  setTime(deviceId: number, time: number) {
    return this.http.patch(`${environment.deviceUrl}/devices/`, {
      id: deviceId,
      time,
      current_time: Date.now()
    }).pipe(first());
  }
}
