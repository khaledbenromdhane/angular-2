import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Conferance } from '../models/conferance';
import { ConferanceService } from '../services/conferance';

@Component({
  selector: 'app-conferance-list',
  imports: [RouterLink],
  templateUrl: './conferance-list.html',
  styleUrl: './conferance-list.css',
})
export class ConferanceList implements OnInit {
  private readonly conferenceService = inject(ConferanceService);
  private readonly destroyRef = inject(DestroyRef);
  readonly conferances = signal<Conferance[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly deletingIds = signal<number[]>([]);

  ngOnInit() {
    this.conferenceService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (conferences) => {
        this.conferances.set(conferences);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les conférences. Vérifiez que le serveur API est démarré.');
        this.loading.set(false);
      },
    });
  }

  deleteConferance(id: number | undefined) {
    if (id === undefined || this.deletingIds().includes(id)) return;
    this.error.set('');
    this.deletingIds.update((ids) => [...ids, id]);
    this.conferenceService.deleteConferance(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.conferances.update((conferences) => conferences.filter((conf) => conf.id !== id));
        this.deletingIds.update((ids) => ids.filter((value) => value !== id));
      },
      error: () => {
        this.error.set('La suppression a échoué. La conférence a été conservée.');
        this.deletingIds.update((ids) => ids.filter((value) => value !== id));
      },
    });
  }
}
