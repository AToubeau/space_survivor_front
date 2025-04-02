import {Component, computed, effect, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ShipService} from '../../service/ship.service';
import {ColonyContextService} from '../../../planet/service/colony-context.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Ship} from '../../../../model/Ship';
import {ShipCreateRequest} from '../../../../model/ShipCreateRequest';
import {ColonyNavComponent} from '../../../../layout/colonyNav/colonynav.component';

@Component({
  selector: 'app-ship-builder',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ColonyNavComponent,
  ],
  templateUrl: './ship-builder.component.html',
  styleUrl: './ship-builder.component.scss'
})
export class ShipBuilderComponent /*implements OnInit*/ {
  private readonly colonyContext = inject(ColonyContextService);
  private readonly shipService = inject(ShipService);

  readonly ships = signal<Ship[]>([]);
  availableShips = this.shipService.shipsByColony;
  selectedQuantities = signal<Record<number, number>>({});

  colonyId = computed(() => this.colonyContext.selectedColony()?.id ?? 0);
  colonyResources = computed(() => this.colonyContext.selectedColony()?.resources ?? []);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    const id = Number(this.route.snapshot.params['id']);
    this.colonyContext.selectColony(id);

    effect(() => {
      const id = this.colonyContext.selectedColony()?.id;
      if (id) {
        this.shipService.fetchShipsByColony(id);
        this.shipService.fetchAllShips().subscribe({
          next: (data) => {
            console.log("data in shipBuilder effect: ", data);
            this.ships.set(data);
          },
        });
      }
    });
  }

  getQuantityForShip(shipId: number): number {
    return this.availableShips().find(s => s.shipId === shipId)?.quantity ?? 0;
  }

  getSelectedQuantity(shipId: number): number {
    return this.selectedQuantities()[shipId] ?? 0;
  }

  updateQuantity(shipId: number, value: number) {
    const updated = { ...this.selectedQuantities() };
    updated[shipId] = Number(value);
    this.selectedQuantities.set(updated);
  }

  getMaxBuildable(ship: Ship): number {
    const resources = this.colonyResources();
    const water = resources.find(r => r.type === 'Water')?.quantity ?? 0;
    const metal = resources.find(r => r.type === 'Metal')?.quantity ?? 0;
    const hydrogen = resources.find(r => r.type === 'Hydrogen')?.quantity ?? 0;

    const maxWater = ship.costWater ? Math.floor(water / ship.costWater) : Infinity;
    const maxMetal = ship.costMetal ? Math.floor(metal / ship.costMetal) : Infinity;
    const maxHydro = ship.costHydrogen ? Math.floor(hydrogen / ship.costHydrogen) : Infinity;

    return Math.max(0, Math.min(maxWater, maxMetal, maxHydro));
  }

  canBuild(): boolean {
    return Object.values(this.selectedQuantities()).some(q => q > 0);
  }

  buildShips() {
    const colonyId = this.colonyId();
    const payload: ShipCreateRequest[] = Object.entries(this.selectedQuantities())
      .filter(([_, qty]) => qty > 0)
      .map(([shipId, quantity]) => ({
        colonyId,
        shipId:Number(shipId),
        quantity,
      }));

    if (payload.length > 0) {
      this.shipService.createShips(payload).subscribe(() => {
        this.shipService.fetchShipsByColony(colonyId);
        this.selectedQuantities.set({});
      });
    }
  }
}
