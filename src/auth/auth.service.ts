import { Injectable } from "@nestjs/common";
import { AuthTokenRequest } from "./models/auth-token-request";
import { AuthTokenResponse } from "./models/auth-token-response";


@Injectable()
export class AuthService {
    constructor() {}

    async getAuthToken(authTokenRequest: AuthTokenRequest): Promise<AuthTokenResponse> {
        return {
            access_token: '1234567890',
            token_type: 'Bearer',
            expires_in: 3600
        };
    }
}