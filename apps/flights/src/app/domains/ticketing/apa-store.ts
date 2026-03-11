import { Injectable, resource, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApaStore {
  apaResource = resource({
    stream: () => {
      const dataSignal = signal({ value: [] as string[] });

      const socket = new WebSocket(
        'wss://push.mbo.apa.at/register?app=psp&instance=3&user=x'
      );
      socket.onmessage = (ev: MessageEvent) => {
        const data = typeof ev.data === 'string' ? ev.data : String(ev.data);
        dataSignal.update((value) => ({ value: [...value.value, data] }));
      };

      return Promise.resolve(dataSignal);
    },
  });
}
