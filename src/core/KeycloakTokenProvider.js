import axios from "axios";

export class KeycloakTokenProvider {
    constructor() {
        this.fetchKeycloakToken = this.fetchKeycloakToken.bind(this);
        this.axios = axios.create();
    }

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

