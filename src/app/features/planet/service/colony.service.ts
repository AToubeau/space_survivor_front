import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {Client} from '@stomp/stompjs';
import {Colony} from '../../../model/colony';
import {AuthService} from '../../auth/services/auth.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ColonyService {
  private client: Client;
  colonies: WritableSignal<Colony[]> = signal([]);

  private readonly http = inject(HttpClient);

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws', // 🔥 Assure-toi que c'est bien "ws" et non "wss"
      reconnectDelay: 5000, // 🔄 Reconnexion automatique après 5 sec
      debug: (msg) => console.log("Websocket debug : ", msg),
    });

    this.client.onConnect = () => {
      console.log("✅ WebSocket connecté !");
      this.subscribeToColonies()
    };

    this.client.onWebSocketError = (err) => {
      console.error("❌ Erreur WebSocket", err);
    };

    this.client.activate();
    this.fetchColonies();
  }

  fetchColonies() {
    console.log("current user in fetch colony : ", localStorage.getItem("currentUser"));
    const username = JSON.parse(localStorage.getItem('currentUser') || '{}')?.user?.username;
    console.log("username : ", username);
    if (!username) return;

    this.http.get<Colony[]>(`http://localhost:8080/api/colonies/${username}`).subscribe({
      next: (colonies) => this.colonies.set(colonies),
      error: (err) => console.error("❌ Erreur lors du chargement des colonies", err),
    });
  }
  private subscribeToColonies() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')?.user;
    if (!user) {
      console.warn("⚠️ Aucun utilisateur connecté, impossible de s'abonner aux colonies.");
      return;
    }

    const username = user.username;
    console.log(`souscription aux colonies pour ${username}`)

    this.client.subscribe(`topic/colonies/${username}`, (message) => {
      const updatedColonies: Colony[] = JSON.parse(message.body);
      console.log(updatedColonies);
    });
    this.client.publish({destination: "/app/updateColonies", body: username})
  }
}
