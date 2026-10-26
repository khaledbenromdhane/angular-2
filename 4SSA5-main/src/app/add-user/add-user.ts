import { Component,inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser {

// //form builder
//   fb= inject(FormBuilder);
//   userForm= this.fb.group({
//     username: ['',[ Validators.required,Validators.maxLength(3)]],
//     email: [''],
//     adress: [''],
//   });

get email() {
  return this.userForm.get('email');
}

//m1 (formGroup)
userForm= new FormGroup({
  username: new FormControl('',[Validators.required,Validators.maxLength(3)]),
  email: new FormControl('',Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')),
  adress: new FormControl('',Validators.minLength(3)),

})
submitForm() {
  console.log(this.userForm.value);
}
}
