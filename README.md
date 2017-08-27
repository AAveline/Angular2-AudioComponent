# ngx-google-signin

## How to install
Run npm i ngx-google-sign-in --save

## How to use
### Declare the module
NgxGoogleSignInModule.forRoot()

### Provide ApiKey
In your root component:
constructor(private provider: GoogleSignInProviderService) {
    provider.init(api-key)
  }
  
 That's all!
 
 ### Public API:
 NgxGoogleSignIn expose the following methods:
 #### computeGoogleSignInElement(domElement): void
 Attach google's handler to the provided DomElement
 #### isLoggedIn:Observable<boolean> 
 Check if an user is already registered
 #### reloadAuthResponse
 Force token refreshing
 #### getAuthResponse(includeAuthorizationData?: boolean)
 #### hasGrantedScopes(scopes: string) 
 Check if the googleUser has the rights on the provided scopes
 #### getCurrentUser:<Subject> 
 Expose the current user
 #### getBasicProfile
 Expose the basic profile of the current user
 #### signOut 
 Sign out the current user
 #### disconnect
 Disconnect the current user
 
 
 
