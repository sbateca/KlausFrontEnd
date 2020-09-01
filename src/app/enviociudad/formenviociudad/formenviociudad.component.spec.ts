import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormenviociudadComponent } from './formenviociudad.component';

describe('FormenviociudadComponent', () => {
  let component: FormenviociudadComponent;
  let fixture: ComponentFixture<FormenviociudadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormenviociudadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormenviociudadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
