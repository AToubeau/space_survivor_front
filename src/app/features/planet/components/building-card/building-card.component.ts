import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Building} from '../../../../model/building';

@Component({
  selector: 'app-building-card',
  imports: [],
  templateUrl: './building-card.component.html',
  styleUrl: './building-card.component.scss'
})
export class BuildingCardComponent {
  @Input() building!:Building;
  @Input() availableWater:number = 0;
  @Input() availableMetal:number = 0;

  @Output() upgrade = new EventEmitter<string>();

  getUpgradeCost(){
    return {
      water: this.building.upgradeCostWater,
      metal: this.building.upgradeCostMetal,
    };
  }

  canUpgrade() : boolean {
    const cost = this.getUpgradeCost();
    return this.availableWater >= cost.water && this.availableMetal >= cost.metal;
  }

  onUpgrade(){
    if (this.canUpgrade()) {
      this.upgrade.emit(this.building.type)
    }
  }

}
