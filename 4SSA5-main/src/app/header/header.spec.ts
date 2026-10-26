import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';

describe('Header', () => {
  it('renders the conference navigation', async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('a[href="/conferences/add"]')).not.toBeNull();
  });
});
