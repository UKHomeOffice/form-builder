import axios from "axios";
import secureLS from "./storage";
import jwt_decode from "jwt-decode";
import axiosRetry, {isNetworkOrIdempotentRequestError} from 'axios-retry';

export class KeycloakTokenProvider {
    constructor() {
        this.fetchKeycloakToken = this.fetchKeycloakToken.bind(this);
        this.axios = axios.create();
        axiosRetry(this.axios, {
            retries: 3,
            retryCondition: (error) => {
                return isNetworkOrIdempotentRequestError(error) || error.status === 403
            }
        });
    }

    fetchKeycloakToken = async (environment, token) => {
        if (!environment) {
            throw Error("No environment provided");
        }
        if (!token) {
            throw Error("No token provided");
        }
        const key = `kc-jwt-${environment.id}`;
        const fetchToken = async () => {
            try {
                const tokenResponse = await this.axios({
                    method: 'GET',
                    url: `/keycloak/${environment.id}/token`,
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (tokenResponse.status !== 200) {
                    return Promise.reject(Error("Failed to get access token"));
                }
                return tokenResponse.data.access_token;
            } catch (e) {
                throw new Error("Failed to get keycloak token from environment: " + environment.id);
            }

        };

        let jwtToken = secureLS.get(key);
        if (!jwtToken) {
            jwtToken = await fetchToken();
            secureLS.set(key, jwtToken);
        } else {
            const isExpired = jwt_decode(jwtToken).exp < new Date().getTime() / 1000;
            if (isExpired) {
                console.log(`Token expired for ${environment.id}...refreshing.`);
                jwtToken = await fetchToken();
                secureLS.set(key, jwtToken);
            }
        }
        return jwtToken;
    };
}

