import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Device} from '../_models/device';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

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
}
