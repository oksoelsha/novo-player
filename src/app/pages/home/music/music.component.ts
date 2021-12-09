import { AfterViewInit, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home-game-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.sass']
})
export class MusicComponent implements AfterViewInit  {

  @Input() musicUrl: string;
  @Input() title: string;
  @ViewChild('audioPlayer', { static: false }) private audioPlayer: ElementRef<HTMLAudioElement>;
  @ViewChild('progressBar', { static: false }) private progressBar: ElementRef<HTMLCanvasElement>;

  playButton = 'active';
  pauseButton = 'hidden';
  totalTime: string;
  elapsedTime: string;

  readonly progressBarWidth = 100;
  readonly progressBarHeight = 6;

  private firstTimeLoadingComponent = true;

  private context: CanvasRenderingContext2D;

  constructor() { }

  ngAfterViewInit(): void {
    if (this.firstTimeLoadingComponent) {
      this.resetIndicators();
      this.firstTimeLoadingComponent = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
      // if this is the first time loading this component, then defer the initialization until ngAfterViewInit() is called
      if (!this.firstTimeLoadingComponent) {
        this.resetButtons();
        this.resetIndicators();
      }
  }

  reset() {
    this.resetButtons();
    this.resetIndicators();
  }

  play() {
    this.playButton = 'hidden';
    this.pauseButton = 'active';

    this.audioPlayer.nativeElement.play();
  }

  pause() {
    this.playButton = 'active';
    this.pauseButton = 'hidden';

    this.audioPlayer.nativeElement.pause();
  }

  setTotalTime() {
    this.totalTime = this.convertElapsedTime(this.audioPlayer.nativeElement.duration);
  }

  updateProgress() {
    const progress = this.audioPlayer.nativeElement.currentTime / this.audioPlayer.nativeElement.duration * this.progressBarWidth;
    this.context.fillStyle = '#676767';
    this.context.fillRect(0, 0, progress, 6);

    this.elapsedTime = this.convertElapsedTime(this.audioPlayer.nativeElement.currentTime);
  }

  private resetButtons() {
    this.playButton = 'active';
    this.pauseButton = 'hidden';

    this.elapsedTime = this.convertElapsedTime(0);
  }

  private resetIndicators() {
    this.audioPlayer.nativeElement.src = this.musicUrl;
    this.audioPlayer.nativeElement.load();

    this.context = this.progressBar.nativeElement.getContext('2d');
    this.context.fillStyle = '#464646';
    this.context.fillRect(0, 0, this.progressBarWidth, 6);
  }

  private convertElapsedTime(time: number): string {
    const seconds: number = Math.floor(time % 60);
    let secondsString: string;
    if (seconds < 10) {
      secondsString = '0' + seconds;
    } else {
      secondsString = seconds.toString();
    }

    const minutes: number = Math.floor(time / 60);

    return minutes + ':' + secondsString;
  }
}
