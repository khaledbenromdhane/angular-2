import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConferanceDetails } from './conferance-details';

describe('ConferanceDetails', () => {
  let fixture: ComponentFixture<ConferanceDetails>;
  let http: HttpTestingController;
  const conf = { id: 1, title: 'Angular', description: 'Formation', location: 'Tunis',
    date: '2036-09-26', price: 10, nbPlaces: 20 };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferanceDetails],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ConferanceDetails);
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
  });
  afterEach(() => http.verify());

  it('renders the HTTP result and reloads when the route id changes', () => {
    http.expectOne('http://localhost:3000/conferences/1').flush(conf);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Angular');
    fixture.componentRef.setInput('id', '2');
    fixture.detectChanges();
    http.expectOne('http://localhost:3000/conferences/2').flush({ ...conf, id: 2, title: 'TypeScript' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('TypeScript');
  });

  it('handles an unknown conference without rendering undefined data', () => {
    http.expectOne('http://localhost:3000/conferences/1')
      .flush({}, { status: 404, statusText: 'Not found' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('introuvable');
    expect(fixture.nativeElement.querySelector('.card')).toBeNull();
  });
});
