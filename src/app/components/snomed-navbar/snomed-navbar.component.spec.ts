import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnomedNavbarComponent } from './snomed-navbar.component';

describe('SnomedNavbarComponent', () => {
  let component: SnomedNavbarComponent;
  let fixture: ComponentFixture<SnomedNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnomedNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnomedNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
