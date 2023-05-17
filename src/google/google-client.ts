import { OAuth2Client } from 'google-auth-library';

class GoogleClient {
  private readonly _client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET,
    process.env.GOOGLE_REDIRECT,
  );

  constructor() {
    this._client.apiKey = process.env.GOOGLE_API_KEY;
  }

  get client() {
    return this._client;
  }
}

export default new GoogleClient();
