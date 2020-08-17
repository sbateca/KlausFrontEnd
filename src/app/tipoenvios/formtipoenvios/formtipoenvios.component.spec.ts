import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormtipoenviosComponent } from './formtipoenvios.component';

describe('FormtipoenviosComponent', () => {
  let component: FormtipoenviosComponent;
  let fixture: ComponentFixture<FormtipoenviosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormtipoenviosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormtipoenviosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
