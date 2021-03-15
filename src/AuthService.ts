import { Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';

export default class AuthService {

  private cognitoUser: CognitoUser | null;

  constructor() {
    this.cognitoUser = null;
  }


  public async signIn(userId: string, accessToken: string) {
    try {
      await this._signIn(userId);
    } catch (e) {
      await this.signUp(userId);
      await this._signIn(userId);
    }
    this.cognitoUser = await Auth.sendCustomChallengeAnswer(this.cognitoUser, accessToken);
  }

  public async signOut() {
    await Auth.signOut();
  }

  private async signUp(userId: string) {
    const params = {
      username: userId,
      password: this.getRandomString(30),
      attributes: {
        email: `${this.getRandomString(30)}@dummy.com`
      }
    };
    await Auth.signUp(params);
  }

  private async _signIn(userId: string) {
    this.cognitoUser = await Auth.signIn(userId);
  }

  private getRandomString(bytes: number) {
    const randomValues = new Uint8Array(bytes);
    window.crypto.getRandomValues(randomValues);
    return Array.from(randomValues).map(this.intToHex).join('');
  }

  private intToHex(nr: number) {
    return nr.toString(16).padStart(2, '0');
  }

  public async isAuthenticated() {
    try {
      await Auth.currentSession();
      return true;
    } catch {
      return false;
    }
  }
}
