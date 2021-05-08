import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { FileSystemChooserComponent } from '../../shared/fs-chooser/fs-chooser.component';
import { FormsModule } from '@angular/forms';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        SettingsComponent,
        FileSystemChooserComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
