import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FileSystemChooserComponent } from 'src/app/shared/fs-chooser/fs-chooser.component';

import { ScanParametersComponent } from './scan-parameters.component';

describe('ScanParametersComponent', () => {
  let component: ScanParametersComponent;
  let fixture: ComponentFixture<ScanParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        ScanParametersComponent,
        FileSystemChooserComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
