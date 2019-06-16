import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Metric} from '../_models/metric';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) {
  }

  getStats() {
    return this.http.get<Metric[]>(`${environment.apiUrl}/statistics/`);
  }

  getLatestStat() {
    return this.http.get<Metric[]>(`${environment.apiUrl}/statistics/lts/`);
  }

  initStatProcess() {
    return this.http.get(`${environment.apiUrl}/statistics/start_task/`);
  }
}
