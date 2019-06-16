import {Injectable} from '@angular/core';
import {Observable, Observer, Subject} from 'rxjs';

@Injectable()
export class WebsocketService {
  constructor() {
  }

  private subject: Subject<any>;

  public connect(url): Subject<any> {
    this.subject = this.create(url);
    return this.subject;
  }

  private create(url): Subject<any> {
    const ws = new WebSocket(url);

    const observable = Observable.create((obs: Observer<any>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    const observer = {
      next: (data: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return Subject.create(observer, observable);
  }
}
