import {Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnInit} from '@angular/core';

declare const window: any;

@Component({
  selector: 'audio-component',
  template: `
    <audio #audioplayer
         [src]="list"
         [autoplay]="autoplay"
         [controls]="controls"
         [volume]="volume"
         [loop]="loop"
         [preload]="preload"
         [muted]="muted"
    >
  </audio>
  <button type="button" (click)="play()" *ngIf="playButton">Play</button>
  <button type="button" (click)="pause()" *ngIf="pauseButton">Pause</button>
  <button type="button" (click)="previousTrack()" *ngIf="selectableButton">Previous</button>
  <button type="button" (click)="nextTrack()" *ngIf="selectableButton">Next</button>
  <button type="button" (click)="muteVideo()" *ngIf="muteButton">Mute</button>
  `
})

export class AudioComponent implements AfterViewInit, OnInit{

  private window: any = window;
  private timeout: any;
  private startTransition: any;
  private interval: any;

  private list: string;
  /**
   * @Input -> custom properties.
   *
   */

  /** Programmatically buttons. */
  @Input() playButton: boolean = false;
  @Input() pauseButton: boolean = false;
  @Input() selectableButton: boolean = false;
  @Input() muteButton: boolean = false;
  /** Array of audio tracks.*/
  @Input() src: Array<string> = [];
  /** Display or not the controls, default: true */
  @Input() controls: boolean = true;
  /** Set autoplay status, default true. */
  @Input() autoplay: boolean = true;
  /** Set loop status, default false. */
  @Input() loop: boolean = false;
  /** Set the volume, default: 1 (max). */
  @Input() volume: number = 1;
  /** Set the start index of the playlist. */
  @Input() startPosition: number = 0;
  /** Number in s, in order to start the transition, default: 5s */
  @Input() transition: number = 5;
  /** Interval in order to set the audio transition, in ms, default: 500ms. */
  @Input() intervalTransition = 500;
  /** Define if transition, default: false. */
  @Input() transitionEnd: boolean = true;
  /** Define the preload status, default metadata. */
  @Input() transitionStart: boolean = false;
  /** Define the preload status, default metadata. */
  @Input() preload: string = 'metadata';
  /** Define the mute status, default false. */
  @Input() muted: boolean = false;
  /**
   * Custom events who could be intercepted.
   * @type {EventEmitter}
   */
  /** Emit the playlist. */
  @Output() playlist = new EventEmitter();
  /** Emit informations on the current video. */
  @Output() current = new EventEmitter();
  /** Emit the progress status of audio dowloading. */
  @Output() progress = new EventEmitter();
  /** Emit downloading status of track. */
  @Output() downloading = new EventEmitter();

  @ViewChild('audioplayer') player: any;

  ngOnInit() {
    /** Init player with the first occurrence of src's array. */
    if (this.src.length) { this.list = this.src[this.startPosition]; }
  }

  ngAfterViewInit() {
    if (this.transitionEnd) {
      this.player.nativeElement.addEventListener('play', () => this.audioTransition(this.player.nativeElement.duration, this.player.nativeElement.currentTime));
    }

    this.player.nativeElement.addEventListener('ended', () => {

      this.player.nativeElement.volume = this.volume;
      /** Increment array position in order to get next audio track. */
      this.startPosition += 1;
      /** If loop is true && startPosition is at last index then reset the playlist. */
      if (this.startPosition >= this.src.length && this.loop)
        this.startPosition = 0;
      /** Else stop the playlist. */
      if (this.startPosition >= this.src.length && !this.loop)
        return;

      /** Set new src track */
      this.player.nativeElement.src = this.src[this.startPosition];
      /** If onChangeTrack is set, then emit the new track. */

    });

    this.player.nativeElement.addEventListener('loadstart', () => {
      this.emitCurrentTrack();

      if (this.transitionStart)
        this.audioStartTransition(this.intervalTransition);
    });

    this.player.nativeElement.addEventListener('pause', () => {
      /** Reset Timeout && Interval. */
      this.window.clearTimeout(this.timeout);
      this.window.clearInterval(this.interval);
    });

    this.player.nativeElement.addEventListener('progress', (data: any) => this.downloading.emit(true));
  }
  /** Set programmatically audio controls. */
  play(): void {
    this.player.nativeElement.play();
  }

  pause(): void {
    this.player.nativeElement.pause();
  }

  muteVideo(): void {
    this.player.nativeElement.muted = !this.player.nativeElement.muted;
  }

  previousTrack() {
    /** If first track, then do nothing. */
    if (this.src.indexOf(this.player.nativeElement.src) <= 0) { return; }
    /** Else go back to previous element in track's array. */
    this.player.nativeElement.src = this.src[this.src.indexOf(this.player.nativeElement.src) - 1];
  }

  nextTrack(): void {
    /** If last track, then do nothing. */
    if (this.src.indexOf(this.player.nativeElement.src) >= this.src.length - 1) { return; }

    /** Else, go to the next element in track's array. */
    this.player.nativeElement.src = this.src[this.src.indexOf(this.player.nativeElement.src) + 1];
  }

  /** Audio Transitions */

  /** Set transition audio. */
  audioTransition(trackDuration: number, timeElapsed: number = 0): void {
    /** Clear setInterval if defined. */
    this.window.clearInterval(this.interval);
    /** Check the currentTime elapsed, then set transition if defined. */
    this.timeout = this.setTimeoutDelay(trackDuration, timeElapsed);
  }

  audioStartTransition(interval: number): void {
    /** Start the transition. */
    this.startTransition = this.setIncrementInterval(interval);
  }

  setTimeoutDelay(trackDuration: number, timeElapsed: number): any {
    /** Timeout who correspond to the remaining time of audio player without the transition's time ( by default 5s before the end). */
    return setTimeout(() => {
      this.interval = this.setDecrementInterval(this.intervalTransition);
    }, (trackDuration - timeElapsed) * 1000 - (this.transition * 1000));
  }

  setIncrementInterval(interval: number): any {
    return setInterval(() => {
      /** Define the new player's volume. Increment by step of 10%.*/
      this.player.nativeElement.volume  += (this.player.nativeElement.volume * 10) / 100;
      /** Security area in order to avoid error. If the player's volume is around 90%, then stop incrment, set the volume to 1. */
      if (this.player.nativeElement.volume >= 0.9) {
        this.player.nativeElement.volume = 1;
        this.window.clearInterval(this.startTransition);
      }
    }, interval);
  }

  setDecrementInterval(interval: number): any {
    return setInterval(() => {
      /** Decrement the volume by step of 10%. */
      this.player.nativeElement.volume  -= (this.player.nativeElement.volume * 10) / 100;
    }, interval);
  }

  /**
   * Emitters
   */
  emitPlayList(): void {
    this.playlist.emit(this.src);
  }

  emitCurrentTrack(): void {
    /**
     * Return an object who will contain: Url of the track, duration, textTrack, volume)
     */
    this.current.emit({
      src: this.player.nativeElement.currentSrc,
      textTracks: this.player.nativeElement.textTracks,
      volume: this.player.nativeElement.volume
    });
  }
}
