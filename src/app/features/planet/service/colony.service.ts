import {effect, inject, Injectable, Injector, signal, WritableSignal} from '@angular/core';
import {Client} from '@stomp/stompjs';
import {Colony} from '../../../model/colony';
import {AuthService} from '../../auth/services/auth.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ColonyService {
  private client: Client;
  colonies: WritableSignal<Colony[]> = signal<Colony[]>([]);

  private readonly http = inject(HttpClient);
  private readonly authService: AuthService = inject(AuthService);

  colonyDetail = signal<Colony|null>(null);

  constructor(injector: Injector) {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
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
    //ça marche comme ça ?

    effect(() => {
      const user =  this.authService.currentUser();
      if (user) {
        console.log("L'utilisateur est connecté :  ", user.playerResponse.username)
        this.fetchColonies();
/*        console.log("client active : ", this.client.active);
        if (this.client.active) {
          this.subscribeToColonies();
        }*/
      }
    });
    this.startResourceInterpolation();
  }

  fetchColonies() {
    const username = this.authService.currentUser()?.playerResponse.username;
    console.log("username : ", username);
    if (!username) return;

    this.http.get<Colony[]>(`http://localhost:8080/api/colonies/me`).subscribe({
      next: (colonies) => this.colonies.set(colonies),
      error: (err) => console.error("❌ Erreur lors du chargement des colonies", err),
    });
  }

  private subscribeToColonies() {
    console.log("subscribeToColonies");
    const user = this.authService.currentUser();
    console.log("subscribeToColonies", user);
    if (!user || !user.playerResponse) {
      console.warn("⚠️ Aucun utilisateur connecté, impossible de s'abonner aux colonies.");
      return;
    }

    const username = user.playerResponse.username;
    console.log(`souscription aux colonies pour ${username}`)

    this.client.subscribe(`topic/colonies/${username}`, (message) => {
      const updatedColonies: Colony[] = JSON.parse(message.body);
      console.log("Mise à jour ws reçue : ", updatedColonies);
      const currentColony = this.colonyDetail();
      if (currentColony) {
        const updatedColony = updatedColonies.find(colony => colony.id === currentColony.id);
        if (updatedColony) {
          console.log("Mise à jour pour la colonie détaillé : ", updatedColony)
          this.colonyDetail.set(updatedColony);
        }
      }

    });
    this.client.publish({destination: "/app/updateColonies", body: username})
  }

  fetchColonyDetail(id: number) {
    return this.http.get<Colony>(`http://localhost:8080/api/colonies/${id}`);
  }

  private startResourceInterpolation() {
    setInterval(() => {
      const currentColony = this.colonyDetail();
      if (currentColony) {
        const updatedResources = currentColony.resources.map(resource => {
          const productionPerSecond = resource.resourcePerMinute/60
          return {
            ...resource,
            quantity:resource.quantity + productionPerSecond
          };
        });
        const updatedColony: Colony = {
          ...currentColony,
          resources: updatedResources
        };
        this.colonyDetail.set(updatedColony);
      }
    }, 1000);
  }

  logout() {
    this.client.deactivate()
  }
}
