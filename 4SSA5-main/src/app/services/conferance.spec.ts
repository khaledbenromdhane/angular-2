import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConferanceService } from './conferance';
import { Conferance } from '../models/conferance';

describe('ConferanceService', () => {
  let service: ConferanceService;
  let http: HttpTestingController;
  const conf: Conferance = {
    id: 1, title: 'Angular', description: 'Formation Angular',
    location: 'Tunis', date: '2036-09-26', price: 10, nbPlaces: 20,
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ConferanceService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('loads the conference list', () => {
    service.getAll().subscribe((result) => expect(result).toEqual([conf]));
    const request = http.expectOne(service.apiUrl);
    expect(request.request.method).toBe('GET');
    request.flush([conf]);
  });

  it('loads one conference', () => {
    service.getById(1).subscribe((result) => expect(result).toEqual(conf));
    const request = http.expectOne(service.apiUrl + '/1');
    expect(request.request.method).toBe('GET');
    request.flush(conf);
  });

  it('creates a conference with POST', () => {
    const { id, ...newConference } = conf;
    service.addConferance(newConference).subscribe((result) => expect(result.id).toBe(1));
    const request = http.expectOne(service.apiUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newConference);
    request.flush(conf);
  });

  it('updates the selected resource using PUT and preserves its id', () => {
    service.updateConferance(1, { ...conf, id: 99, title: 'Updated' }).subscribe();
    const request = http.expectOne(service.apiUrl + '/1');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ ...conf, title: 'Updated' });
    request.flush({ ...conf, title: 'Updated' });
  });

  it('deletes the selected resource using DELETE', () => {
    service.deleteConferance(1).subscribe();
    const request = http.expectOne(service.apiUrl + '/1');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
