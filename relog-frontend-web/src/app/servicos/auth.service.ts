import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { environment } from "../../environments/environment";
import { SettingsService } from "./settings.service";
import axios from "axios";

@Injectable()
export class AuthenticationService {
  constructor(private settingsService: SettingsService) {}

  /**
   * Executes the login in the server.
   * Returns:
   * - 200 - OK
   * - 400 - Incorrect email or password
   * - 402 - Expired contract
   * @param password 
   * @param username 
   */
  async login(password: string, username: string) {
    try {
      let result = await axios.post(`${environment.url}/users/sign_in`, {
        email: username,
        password: password,
      });

      console.log("auth: result post", result);

      if (result.status == 200) this.auth(result.data);

      return result.status;
    } catch (error) {
      this.handleError;
      return error.response.status;
    }
  }

  private handleError(error: Response) {
    return Observable.throw(error);
  }

  async auth(user) {
    // login successful if there's a jwt token in the response
    if (user) {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem("currentUser", JSON.stringify(user));

      //save user seetings
      try {
        let actualSettings = await this.settingsService.getSettings();
        localStorage.setItem(
          "currentSettings",
          JSON.stringify(actualSettings.data)
        );
      } catch (error) {
        console.log(error);
      }
    }
    return user;
  }

  currentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
  }

  currentSettings() {
    return JSON.parse(localStorage.getItem("currentSettings"));
  }

  updateCurrentUser() {
    var user = JSON.parse(localStorage.getItem("currentUser"));
    this.login(user.password, user.email);
  }

  async updateCurrentSettings() {
    let actualSettings = await this.settingsService.getSettings();
    localStorage.setItem(
      "currentSettings",
      JSON.stringify(actualSettings.data)
    );
  }

  logout() {
    this.loglogout();
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentSettings");
  }

  loglogout() {
    let user = this.currentUser();
    axios.post(`${environment.url}/logs`, {
      user: user._id,
      log: "logout",
    });
  }
}
