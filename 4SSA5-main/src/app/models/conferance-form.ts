import { FormControl, FormGroup, Validators } from '@angular/forms';

// Le même modèle de formulaire est utilisé pour l'ajout et la modification.
export function createConferanceForm() {
  return new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    location: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    nbPlaces: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)] }),
  });
}
