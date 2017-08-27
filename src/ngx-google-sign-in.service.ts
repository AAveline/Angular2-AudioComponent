import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx'

declare const window: any;
/**
 * Choses a faire:
 * Exposer les methodes suivantes:
 * - Une methode qui retourne le googleUser (.get())
 * - Une methode qui retourne le googleAuth object
 * - Faire deux subjects qui exposent les deux objets precedement cités.
 * - Faire un component qui wrap le google sign et qui expose les methodes essentielles via des output, et qui prend
 * en input des styles, des clés (init etc)
 */
@Injectable()
export class GoogleSignInProviderService {
  public apiKey: string;
  public googleAuth: any;
  public googleUser: any = new Subject();
  public window = window;
  constructor() {}

  /**
   * Init OAuth2 with provided Google's ApiKey.
   * @param key
     */
  public init(key: string) {
    this.apiKey = key;
    const that = this;
    this.window.gapi.load('auth2', function() {
      that.googleAuth = that.window.gapi.auth2.init({
        client_id: that.apiKey
      });
    });
  }

  /**
   * Check if an User is already registered.
   * If it's the case, then go to the method who will dispatch the user.
   * @returns {any}
     */
  public isLoggedIn(): Observable<boolean> {
    const that = this;
    return Observable.create((observer: any) => {
      this.isAvailable().then(() => {
        this.googleAuth.isSignedIn.listen(function(isLogged: boolean) {
          if (isLogged)
            that.dispatchGoogleUser();
          observer.next(that.googleAuth.isSignedIn.get());
        });
      });
    });
  }

  /**
   * Dispatch the google user across the application.
   */
  public dispatchGoogleUser(): void {
    this.setGoogleUser(this.googleAuth.isSignedIn.get());
  }

  /**
   * Render a custom element for GoogleSignIn button.
   * Then attach an handler && return the response.
   * @param domElement
   * @returns {any}
     */
  public computeGoogleSignInElement(domElement: any) {
    const that = this;
    return Observable.create((observer: any) => {
      this.isAvailable().then(() => {
        return this.googleAuth.attachClickHandler((domElement), {},
          function(googleUser: any) {
            that.setGoogleUser(googleUser);
            observer.next(googleUser);
          }, function(error: any) {
            observer.error(alert(JSON.stringify(error, undefined, 2)));
          });
      });
    });
  }

  /**
   * Reload the token.
   * @returns {any}
   */
  public reloadAuthResponse() {
    return Observable.create((observer: any) => {
      this.getCurrentUser().get().reloadAuthResponse().then((data: any) => observer.next(data));
    });
  }

  /**
   * Get AuthResponse.
   * @param includeAuthorizationData
   * @returns {any}
   */
  public getAuthResponse(includeAuthorizationData?: boolean) {
    return Observable.create((observer: any) => {
      observer.next(this.getCurrentUser().get().getAuthResponse(includeAuthorizationData));
    });
  }

  /**
   * Check if the user a the rights specified in the scopes.
   * @param scopes
   * @returns {any}
   */
  public hasGrantedScopes(scopes: string) {
    return Observable.create((observer: any) => {
      observer.next(this.getCurrentUser().get().hasGrantedScopes(scopes));
    });
  }
  /**
   * Expose GoogleUser.
   */
  public getCurrentUser(): any {
    return this.googleAuth.currentUser;
  }

  /**
   * Expose BasicProfile informations.
   * @returns {any}
   */
  public getBasicProfile() {
    return this.getCurrentUser().get().getBasicProfile();
  }
  public getGoogleUser() {
    return this.googleUser;
  }

  /**
   * Emit the current user object.
   * @param googleUser
   */
  public setGoogleUser(googleUser: any) {
    this.googleUser.next(this.getCurrentUser().get());
  }
  /**
   * Helpers.
   */
  public isAvailable() {
    return new Promise((resolve) => {
      this.window.gapi.load('auth2', function () {
        resolve(true);
      });
    });
  }

  /**
   * Logout.
   */
  public signOut() {
    this.googleAuth.signOut();
  }
  public disconnect() {
    this.googleAuth.disconnect();
  }
}
