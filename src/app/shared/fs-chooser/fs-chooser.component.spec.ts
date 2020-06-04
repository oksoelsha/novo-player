import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSystemChooserComponent } from './fs-chooser.component';

describe('FileSystemChooserComponent', () => {
  let component: FileSystemChooserComponent;
  let fixture: ComponentFixture<FileSystemChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileSystemChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSystemChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
