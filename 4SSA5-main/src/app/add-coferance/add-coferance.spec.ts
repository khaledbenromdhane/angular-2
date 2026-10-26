import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AddCoferance } from './add-coferance';

describe('AddCoferance', () => {
  let fixture: ComponentFixture<AddCoferance>;
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCoferance],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AddCoferance);
    fixture.detectChanges();
  });
  afterEach(() => http.verify());

  it('blocks an empty form', () => {
    fixture.componentInstance.submitForm();
    expect(fixture.componentInstance.conferenceForm.invalid).toBe(true);
    http.expectNone('http://localhost:3000/conferences');
  });

  it('posts the form then returns to the list', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const conf = { title: 'Angular', description: 'Formation', location: 'Tunis',
      date: '2036-09-26', price: 10, nbPlaces: 20 };
    fixture.componentInstance.conferenceForm.setValue(conf);
    fixture.componentInstance.submitForm();
    const request = http.expectOne('http://localhost:3000/conferences');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(conf);
    request.flush({ ...conf, id: 3 });
    expect(navigate).toHaveBeenCalledWith(['/list']);
  });
});
