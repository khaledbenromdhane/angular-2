import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Conferance } from '../models/conferance';
import { ConferanceService } from '../services/conferance';

@Component({
  selector: 'app-conferance-details',
  imports: [RouterLink],
  templateUrl: './conferance-details.html',
  styleUrl: './conferance-details.css',
})
export class ConferanceDetails {
  private readonly conferenceService = inject(ConferanceService);
  readonly id = input.required<string>();
  readonly conference = signal<Conferance | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor() {
    effect((onCleanup) => {
      const id = Number(this.id());
      this.conference.set(null);
      this.error.set('');
      this.loading.set(true);
      if (!Number.isInteger(id) || id <= 0) {
        this.error.set('Identifiant de conférence invalide.');
        this.loading.set(false);
        return;
      }
      const subscription = this.conferenceService.getById(id).subscribe({
        next: (conference) => {
          this.conference.set(conference);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Conférence introuvable ou serveur API indisponible.');
          this.loading.set(false);
        },
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }
}
