import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceLearningLayoutComponent } from './resource-learning-layout.component';

describe('ResourceLearningLayoutComponent', () => {
  let component: ResourceLearningLayoutComponent;
  let fixture: ComponentFixture<ResourceLearningLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceLearningLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceLearningLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
