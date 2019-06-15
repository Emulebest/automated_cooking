import {Injectable} from '@angular/core';
import {Message} from '../_models/message';
import {Observable, Subject} from 'rxjs';
import {WebsocketService} from './websocket.service';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public messages: Observable<Message>;

  constructor(wsService: WebsocketService) {
    this.messages = wsService.connect(environment.wsUrl).pipe(
      map((response: MessageEvent): Message => {
        const data = JSON.parse(response.data);
        return {
          author: data.author,
          message: data.message
        };
      })
    );
  }
}
