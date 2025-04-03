import {Component, inject} from '@angular/core';
import {ColonyService} from '../../service/colony.service';
import {AuthService} from '../../../auth/services/auth.service';
import {CommonModule} from '@angular/common';
import {Router} from "@angular/router";

@Component({
  selector: 'app-colony-list',
  imports: [CommonModule],
  templateUrl: './colony-list.component.html',
  styleUrl: './colony-list.component.scss'
})
export class ColonyListComponent {
  protected readonly colonyService = inject(ColonyService)
  colonies = this.colonyService.colonies;
  private readonly router: Router = inject(Router);


  onColonyClick(colonyId: number) {
    // Navigue vers la page détail de la colonie
    this.router.navigate(['/colonies', colonyId]);
  }
}
