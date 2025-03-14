import {Component, inject} from '@angular/core';
import {ColonyService} from '../../service/colony.service';
import {AuthService} from '../../../auth/services/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-colony-list',
  imports: [CommonModule],
  templateUrl: './colony-list.component.html',
  styleUrl: './colony-list.component.scss'
})
export class ColonyListComponent {
  protected readonly colonyService = inject(ColonyService)
  colonies = this.colonyService.colonies;
}
