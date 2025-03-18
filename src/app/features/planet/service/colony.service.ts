import {inject, Injectable, Injector, signal, WritableSignal} from '@angular/core';
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
  colonies: WritableSignal<Colony[]> = signal([]);

  private readonly http = inject(HttpClient);
  /*private readonly authService: AuthService = inject(AuthService);*/

  private colonyDetailSubject = new BehaviorSubject<Colony | null>(null);
  colonyDetailUpdates$ = this.colonyDetailSubject.asObservable();

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
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')?.playerResponse;
    if (currentUser && currentUser.username) {
      console.log("✅ Utilisateur déjà connecté, chargement des colonies...");
      this.fetchColonies();
      this.subscribeToColonies();
    }
/*    this.authService.userLoggedIn.subscribe(() => {
      console.log("✅ L'utilisateur vient de se connecter, chargement des colonies...");
      this.fetchColonies();
      if (this.client.active) {
        console.log("Le client est déjà connecté, on lance la souscription...");
        this.subscribeToColonies();
      } else {
        console.log("Le client n'est pas connecté, on attend onConnect...");
      }
    })
    if (this.authService.currentUser()) {
      this.fetchColonies();
    }*/
    this.startResourceInterpolation();
  }

  fetchColonies() {
    const username = JSON.parse(localStorage.getItem('currentUser') || '{}')?.playerResponse.username;
    console.log("username : ", username);
    if (!username) return;

    this.http.get<Colony[]>(`http://localhost:8080/api/colonies/me`).subscribe({
      next: (colonies) => this.colonies.set(colonies),
      error: (err) => console.error("❌ Erreur lors du chargement des colonies", err),
    });
  }

  private subscribeToColonies() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')?.playerResponse;
    if (!user) {
      console.warn("⚠️ Aucun utilisateur connecté, impossible de s'abonner aux colonies.");
      return;
    }

    const username = user.username;
    console.log(`souscription aux colonies pour ${username}`)

    this.client.subscribe(`topic/colonies/${username}`, (message) => {
      const updatedColonies: Colony[] = JSON.parse(message.body);
      console.log("Mise à jour ws reçue : ", updatedColonies);
      const currentColony = this.colonyDetailSubject.value;
      if (currentColony) {
        const updatedColony = updatedColonies.find(colony => colony.id === currentColony.id);
        if (updatedColony) {
          console.log("Mise à jour pour la colonie détaillé : ", updatedColony)
          this.colonyDetailSubject.next(updatedColony);
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
      const currentColony = this.colonyDetailSubject.value;
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
        this.colonyDetailSubject.next(updatedColony);
      }
    }, 1000);
  }

  logout() {
    this.client.deactivate()
  }
}
