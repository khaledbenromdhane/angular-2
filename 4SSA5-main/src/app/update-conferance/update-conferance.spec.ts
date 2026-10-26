import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { UpdateConferance } from './update-conferance';
import { ConferanceList } from '../conferance-list/conferance-list';

describe('UpdateConferance', () => {
  let fixture: ComponentFixture<UpdateConferance>;
  let http: HttpTestingController;
  const conf = { id: 1, title: 'Angular', description: 'Formation', location: 'Tunis',
    date: '2036-09-26', price: 10, nbPlaces: 20, time: '10:00 am' };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateConferance],
      providers: [provideRouter([{ path: 'list', component: ConferanceList }]),
        provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(UpdateConferance);
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
    http.expectOne('http://localhost:3000/conferences/1').flush(conf);
    fixture.detectChanges();
  });
  afterEach(() => http.verify());

  it('prefills the form and saves edits through PUT before navigation', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    expect(fixture.nativeElement.querySelector('#title').value).toBe('Angular');
    expect(fixture.nativeElement.querySelector('#date').value).toBe('2036-09-26');
    const input = fixture.nativeElement.querySelector('#title') as HTMLInputElement;
    input.value = 'Angular avancé';
    input.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
    const request = http.expectOne('http://localhost:3000/conferences/1');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ ...conf, title: 'Angular avancé' });
    expect(navigate).not.toHaveBeenCalled();
    request.flush(request.request.body);
    expect(navigate).toHaveBeenCalledWith(['/list']);
  });

  it('rejects invalid values without sending a request', () => {
    fixture.componentInstance.conferenceForm.patchValue({ title: ' ', price: -1, nbPlaces: 1.5 });
    fixture.componentInstance.submitForm();
    expect(fixture.componentInstance.conferenceForm.invalid).toBe(true);
    http.expectNone('http://localhost:3000/conferences/1');
  });

  it('retains edits and enables retry if the server rejects the update', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture.componentInstance.conferenceForm.patchValue({ title: 'New title' });
    fixture.componentInstance.submitForm();
    http.expectOne('http://localhost:3000/conferences/1')
      .flush({}, { status: 500, statusText: 'Server error' });
    fixture.detectChanges();
    expect(fixture.componentInstance.saving()).toBe(false);
    expect(fixture.componentInstance.conferenceForm.controls.title.value).toBe('New title');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('échoué');
    expect(navigate).not.toHaveBeenCalled();
  });
});
