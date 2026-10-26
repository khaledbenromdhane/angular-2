import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConferanceList } from './conferance-list';

describe('ConferanceList', () => {
  let fixture: ComponentFixture<ConferanceList>;
  let http: HttpTestingController;
  const conf = { id: 1, title: 'Angular', description: 'Formation', location: 'Tunis',
    date: '2036-09-26', price: 10, nbPlaces: 20 };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferanceList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ConferanceList);
    fixture.detectChanges();
  });
  afterEach(() => http.verify());

  it('renders server data and links to the update form', () => {
    http.expectOne('http://localhost:3000/conferences').flush([conf]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Angular');
    expect(fixture.nativeElement.textContent).toContain('Tunis');
    expect(fixture.nativeElement.textContent).toContain('Modifier');
  });

  it('keeps the card until the delete request succeeds and blocks duplicate deletion', () => {
    http.expectOne('http://localhost:3000/conferences').flush([conf]);
    fixture.detectChanges();
    const buttons = [...fixture.nativeElement.querySelectorAll('button')] as HTMLButtonElement[];
    buttons.find((button) => button.textContent?.includes('Supprimer'))!.click();
    fixture.componentInstance.deleteConferance(1);
    const request = http.expectOne('http://localhost:3000/conferences/1');
    expect(request.request.method).toBe('DELETE');
    expect(fixture.componentInstance.conferances()).toEqual([conf]);
    request.flush({});
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.card').length).toBe(0);
    expect(fixture.componentInstance.deletingIds()).toEqual([]);
  });

  it('keeps data and allows retry after deletion fails', () => {
    http.expectOne('http://localhost:3000/conferences').flush([conf]);
    fixture.componentInstance.deleteConferance(1);
    http.expectOne('http://localhost:3000/conferences/1')
      .flush({}, { status: 500, statusText: 'Server error' });
    fixture.detectChanges();
    expect(fixture.componentInstance.conferances()).toEqual([conf]);
    expect(fixture.componentInstance.deletingIds()).toEqual([]);
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('échoué');
  });

  it('shows a readable API loading error', () => {
    http.expectOne('http://localhost:3000/conferences')
      .flush({}, { status: 500, statusText: 'Server error' });
    fixture.detectChanges();
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Impossible');
  });
});
