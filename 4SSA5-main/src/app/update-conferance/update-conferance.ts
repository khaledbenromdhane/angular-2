import { Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Conferance } from '../models/conferance';
import { createConferanceForm } from '../models/conferance-form';
import { ConferanceService } from '../services/conferance';

@Component({
  selector: 'app-update-conferance',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './update-conferance.html',
  styleUrl: './update-conferance.css',
})
export class UpdateConferance {
  private readonly conferenceService = inject(ConferanceService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly id = input.required<string>();
  readonly conferenceForm = createConferanceForm();
  readonly conference = signal<Conferance | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');

  constructor() {
    effect((onCleanup) => {
      const id = Number(this.id());
      this.loading.set(true);
      this.conference.set(null);
      this.error.set('');
      if (!Number.isInteger(id) || id <= 0) {
        this.error.set('Identifiant de conférence invalide.');
        this.loading.set(false);
        return;
      }
      const subscription = this.conferenceService.getById(id).subscribe({
        next: (conference) => {
          this.conference.set(conference);
          this.conferenceForm.reset(conference);
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

  submitForm() {
    const conference = this.conference();
    if (this.conferenceForm.invalid || !conference || this.saving()) {
      this.conferenceForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set('');
    this.conferenceService.updateConferance(Number(this.id()), {
      ...conference,
      ...this.conferenceForm.getRawValue(),
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { void this.router.navigate(['/list']); },
      error: () => {
        this.error.set('La modification a échoué. Vous pouvez réessayer.');
        this.saving.set(false);
      },
    });
  }
}
