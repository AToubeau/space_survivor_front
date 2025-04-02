import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {ColonyService} from './colony.service';
import {RessourceByColony} from '../../../model/ressource-by-colony';
import {Colony} from '../../../model/colony';

@Injectable({
  providedIn: 'root'
})
export class ColonyContextService {
  private readonly colonyService = inject(ColonyService);

  selectedColonyId = signal<number | null>(null);

  selectedColony = computed(() => {
    const id = this.selectedColonyId();
    return this.colonyService.colonies().find(c => c.id === id) ?? null;
  });

  constructor() {
    effect(() => {
      const stompReady = this.colonyService.stompActive();
      const currentColonyId = this.selectedColonyId();
      console.log("test effect in context");
      if (stompReady && currentColonyId !== null) {
        this.colonyService.subscribeToColonyDetail((updatedColony) => {
          const currentId = this.selectedColonyId();
          if (updatedColony.id === currentId) {
            this.updateSelectedColony(updatedColony);
            console.log("coloy updated", updatedColony);
          }
        });
      }
    });
  }

  selectColony(id: number) {
    this.selectedColonyId.set(id);
  }

  updateSelectedColony(updated: Colony) {
    const colonies = this.colonyService.colonies();
    const newColonies = colonies.map(c => c.id === updated.id ? updated : c);
    this.colonyService.colonies.set(newColonies);
  }

  getCurrentQuantity(res: RessourceByColony):number {
    return this.colonyService.getCurrentQuantity(res)
  }
}

