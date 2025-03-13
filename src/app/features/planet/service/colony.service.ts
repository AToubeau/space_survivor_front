import {Injectable, signal, WritableSignal} from '@angular/core';
import {Client} from '@stomp/stompjs';
import {Colony} from '../pages/model/colony';

@Injectable({
  providedIn: 'root'
})
export class ColonyService {
  private client: Client;
  colonies: WritableSignal<Colony[]> = signal([]);

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws', // 🔥 Assure-toi que c'est bien "ws" et non "wss"
      reconnectDelay: 5000, // 🔄 Reconnexion automatique après 5 sec
      debug: (msg) => console.log(msg),
    });

    this.client.onConnect = () => {
      console.log("✅ WebSocket connecté !");
    };

    this.client.onWebSocketError = (err) => {
      console.error("❌ Erreur WebSocket", err);
    };

    this.client.activate();
  }
}
