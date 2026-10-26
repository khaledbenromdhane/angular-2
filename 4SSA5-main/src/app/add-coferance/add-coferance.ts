import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { createConferanceForm } from '../models/conferance-form';
import { ConferanceService } from '../services/conferance';

@Component({
  selector: 'app-add-coferance',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-coferance.html',
  styleUrl: './add-coferance.css',
})
export class AddCoferance {
  private readonly conferenceService = inject(ConferanceService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly conferenceForm = createConferanceForm();
  readonly saving = signal(false);
  readonly error = signal('');

  submitForm() {
    if (this.conferenceForm.invalid || this.saving()) {
      this.conferenceForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set('');
    this.conferenceService.addConferance(this.conferenceForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { void this.router.navigate(['/list']); },
        error: () => {
          this.error.set("L'ajout a échoué. Vous pouvez réessayer.");
          this.saving.set(false);
        },
      });
  }
}
