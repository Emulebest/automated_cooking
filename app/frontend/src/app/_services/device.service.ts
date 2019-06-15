import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Device} from '../_models/device';
import {environment} from '../../environments/environment';
import {Observable, Subject} from 'rxjs';

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
    });
  }

  readDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${environment.deviceUrl}/devices/`);
  }

  inputNewDevice(device: Device) {
    this.newDeviceCreated.next(device);
  }
}