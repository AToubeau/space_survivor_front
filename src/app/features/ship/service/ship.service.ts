import {inject, Injectable, signal, Signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ShipCreateRequest} from '../../../model/ShipCreateRequest';
import {ShipByColony} from '../../../model/ShipByColony';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShipService {
  private readonly http = inject(HttpClient);

  shipsByColony: WritableSignal<ShipByColony[]> = signal([]);

  fetchShipsByColony(colonyId: number): void {
    this.http.get<ShipByColony[]>(`http://localhost:8080/api/ships/colony/${colonyId}`)
      .subscribe({
        next: (ships) => this.shipsByColony.set(ships),
        error: (err) => console.error("❌ Erreur lors du chargement des vaisseaux", err),
      });
  }

  createShips(requests: ShipCreateRequest[]): Observable<void> {
    return this.http.post<void>(`http://localhost:8080/api/ships`, requests);
  }
}
