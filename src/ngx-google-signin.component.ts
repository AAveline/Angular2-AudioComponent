import {Component, Input, Output, EventEmitter, AfterViewInit, ViewChild} from '@angular/core';
import {GoogleSignInProviderService} from "../services/ngx-google-sign-in.service";

@Component({
  selector: 'ngx-google-sign-in',
  template: `
  <button #googleContainer class="customGPlusSignIn" [innerHTML]="text">
  </button>
  `
})

export class NgxGoogleSignInComponent implements AfterViewInit {
  @ViewChild('googleContainer') googleContainer: any;
  @Input() styles: any;
  @Input() text: string = 'Google';
  @Input() apiKey: string;
  @Output() onSignIn = new EventEmitter<any>();
  @Output() onRefreshToken = new EventEmitter<any>();
  @Output() onSignOut = new EventEmitter<boolean>();
  @Output() onDisconnect = new EventEmitter<boolean>();
  constructor(private googleProvider: GoogleSignInProviderService) {}

  ngAfterViewInit() {
    this.googleProvider.computeGoogleSignInElement(this.googleContainer.nativeElement).subscribe((data: any) => console.log(data));
  }
  public signIn() {
  }

  public refreshToken() {
  }

  public signOut() {
  }

  public disconnect() {

  }
}
