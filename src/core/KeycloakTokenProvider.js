import axios from "axios";
import jwt_decode from "jwt-decode";

export class KeycloakTokenProvider {
    constructor() {
        this.fetchKeycloakToken = this.fetchKeycloakToken.bind(this);
        this.axios = axios.create();
        this.axios.interceptors.response.use(response => {
            return response;
        }, async error => {
            return this.handleError(this.axios, error);
        });
    }

    handleError = async (instance, error) => {
        if (error.response) {
            const isExpired = jwt_decode(error.response.config.headers['Authorization'].replace('Bearer', '')).exp < new Date().getTime() / 1000;
            if ((error.response.status ===  403 || error.response.status === 401) && isExpired) {
                console.log("Retrying...");
                return await instance.request(error.response.config);
            } else {
                return Promise.reject(error);
            }
        } else {
            return Promise.reject(error);
        }
    };

    fetchKeycloakToken = async (environment, token) => {
        if (!environment) {
            throw Error("No environment provided");
        }
        if (!token) {
            throw Error("No token provided");
        }
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
        return await fetchToken();
    };
}

