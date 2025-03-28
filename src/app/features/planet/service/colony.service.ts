import {computed, effect, inject, Injectable, Injector, signal, WritableSignal} from '@angular/core';
import {Client} from '@stomp/stompjs';
import {Colony} from '../../../model/colony';
import {AuthService} from '../../auth/services/auth.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from "rxjs";
import {RessourceByColony} from '../../../model/ressource-by-colony';

@Injectable({
  providedIn: 'root'
})
export class ColonyService {
  private client: Client | null;
  colonies: WritableSignal<Colony[]> = signal<Colony[]>([]);

  private readonly http = inject(HttpClient);
  private readonly authService: AuthService = inject(AuthService);

  colonyDetail = signal<Colony|null>(null);
  currentTime = signal<number>(Date.now());

  stompActive = signal<boolean>(false);
  resources = computed(() => this.colonyDetail()?.resources ?? []);

  constructor(injector: Injector) {
    setInterval(() => {
      this.currentTime.set(Date.now());
    }, 1000);

    this.client = null;

    effect(() => {
      const user =  this.authService.currentUser();
      if (user && user.playerResponse) {
        console.log("L'utilisateur est connecté :  ", user.playerResponse.username)
        this.initializeWS()
        this.fetchColonies();
      }
    });
  }

  private initializeWS(): void {
    if (this.client && this.client.active) {
      console.log("WS déjà actif");
      return;
    }
    console.log("Initialisation du WS");
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      debug: (msg) => console.log("Websocket debug : ", msg),
    });
    this.client.onConnect = () => {
      console.log("✅ WebSocket connecté !");
      this.stompActive.set(true);
      this.subscribeToColonies();
    };
    this.client.onWebSocketError = (err) => {
      console.error("❌ Erreur WebSocket", err);
    };
    this.client.activate();
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

  subscribeToColonies() {
    console.log("subscribeToColonies");
    const user = this.authService.currentUser();
    console.log("subscribeToColonies", user);
    if (!user || !user.playerResponse) {
      console.warn("⚠️ Aucun utilisateur connecté, impossible de s'abonner aux colonies.");
      return;
    }

    const username = user.playerResponse.username;
    console.log(`souscription aux colonies pour ${username}`)

    this.client?.subscribe(`/topic/colonies/${username}`, (message) => {
      const data = JSON.parse(message.body);
      console.log("Message WS brut reçu :", data);
      let updatedColonies: Colony[] = Array.isArray(data) ? data : [data];
      console.log("Traitement comme tableau :", updatedColonies);
      const currentColony = this.colonyDetail();
      if (currentColony) {
        const updatedColony = updatedColonies.find(colony => colony.id === currentColony.id);
        if (updatedColony) {
          console.log("Mise à jour pour la colonie détaillée : ", updatedColony);
          this.colonyDetail.set(updatedColony);
        }
      }
    });
    this.client?.publish({destination: "/app/updateColonies", body: username})
  }

  getCurrentQuantity(resource: RessourceByColony): number {
    const lastUpdate  = new Date(resource.updatedAt).getTime();
    const secondsElapsed = (this.currentTime() - lastUpdate)/1000;
    const productionPerSecond = resource.resourcePerMinute / 60;

    return resource.quantity + productionPerSecond * secondsElapsed;
  }

  logout() {
    this.client?.deactivate()
  }

  upgradeBuilding(colonyId: number, type: string) :Observable<void> {
    return this.http.post<void>(`http://localhost:8080/api/buildings/upgrade/${colonyId}/${type}`, null)
  }
}
