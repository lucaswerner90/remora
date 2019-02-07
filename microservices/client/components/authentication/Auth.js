import auth0 from 'auth0-js';
import jwtDecode from 'jwt-decode';
import Router from 'next/router';

class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'remora.auth0.com',
    clientID: 'Sq1hVj5mLWwmUtMmXzKl8ONBpEX17YK3',
    redirectUri: 'http://localhost:3000/callback',
    audience: "https://remora.auth0.com/userinfo",
    responseType: "token id_token",
    scope: "openid profile email"
  });

  constructor(){
  }

  login(){
    this.auth0.authorize();
  }

  logout() {
    sessionStorage.removeItem("remora_access_token");
    sessionStorage.removeItem("remora_id_token");
    sessionStorage.removeItem("remora_expires_at");
    this.auth0.logout();
    Router.push("/");
  }

  getProfile(){
    if (sessionStorage.getItem("remora_id_token")) {
      const profile = jwtDecode(sessionStorage.getItem("remora_id_token"));
      return profile;
    } else {
      return {};
    }
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResults) => {
      if (authResults && authResults.accessToken && authResults.idToken) {
        let expiresAt = JSON.stringify((authResults.expiresIn) * 1000 + new Date().getTime());
        sessionStorage.setItem("remora_access_token", authResults.accessToken);
        sessionStorage.setItem("remora_id_token", authResults.idToken);
        sessionStorage.setItem("remora_expires_at", expiresAt);
        Router.push('/dashboard');
      } else if (err) {
        console.log(err);
      }
    });
  }

  isAuthenticated() {
    let expiresAt = JSON.parse(sessionStorage.getItem("remora_expires_at"));
    return new Date().getTime() < expiresAt;
  }
}

const auth = new Auth();

export default auth;