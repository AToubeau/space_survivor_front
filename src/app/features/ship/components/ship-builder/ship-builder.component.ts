import {Component, computed, inject, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ShipService} from '../../service/ship.service';
import {ColonyContextService} from '../../../planet/service/colony-context.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {Ship} from '../../../../model/Ship';

@Component({
  selector: 'app-ship-builder',
  imports: [
    FormsModule,
    NgForOf,
  ],
  templateUrl: './ship-builder.component.html',
  styleUrl: './ship-builder.component.scss'
})
export class ShipBuilderComponent {
  private colonyContext = inject(ColonyContextService);
  private shipService = inject(ShipService);

  colony = this.colonyContext.selectedColony;
  ships = this.shipService.shipsByColony;
  availableResources = computed(() => this.colony()?.resources ?? []);

  shipList: Ship[] = [];
  formValues: WritableSignal<Record<number, number>> = signal({}); // shipId -> quantity

  constructor() {
    this.shipService.fetchShipsByColony(this.colony()?.id ?? 0);
  }

  getCurrentQuantity(shipId: number): number {
    return this.ships().find(s => s.shipId === shipId)?.quantity ?? 0;
  }

  getMaxBuildable(ship: Ship): number {
    const currentFormValues = this.formValues();
    const selectedSoFar = Object.entries(currentFormValues).reduce((acc, [id, qty]) => {
      const s = this.shipList.find(s => s.id === id);
      if (!s) return acc;
      acc.water += s.costWater * qty;
      acc.metal += s.costMetal * qty;
      acc.hydrogen += s.costHydrogen * qty;
      return acc;
    }, { water: 0, metal: 0, hydrogen:0 });

    const colonyResources = this.availableResources();
    const availableWater = colonyResources.find(r => r.type === 'Water')?.quantity ?? 0;
    const availableMetal = colonyResources.find(r => r.type === 'Metal')?.quantity ?? 0;

    const maxWater = Math.floor((availableWater - selectedSoFar.water) / ship.costWater);
    const maxMetal = Math.floor((availableMetal - selectedSoFar.metal) / ship.costMetal);
    return Math.max(0, Math.min(maxWater, maxMetal));
  }

  onInput(shipId: number, quantity: number) {
    const newForm = { ...this.formValues() };
    newForm[shipId] = quantity;
    this.formValues.set(newForm);
  }

  buildShips() {
    const payload = Object.entries(this.formValues()).map(([shipId, quantity]) => ({
      shipId: +shipId,
      colonyId: this.colony()?.id ?? 0,
      quantity: quantity
    }));
    this.shipService.createShips(payload).subscribe(() => {
      this.shipService.fetchShipsByColony(this.colony()?.id ?? 0);
      this.formValues.set({});
    });
  }
}
