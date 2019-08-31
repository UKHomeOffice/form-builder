import axios from "axios";

export class KeycloakTokenProvider {
    constructor() {
        this.fetchKeycloakToken = this.fetchKeycloakToken.bind(this);

    }

    handleError = async (instance, error, keycloak) => {
        if (error.response) {
            if ((error.response.status === 403 || error.response.status === 401)) {
                console.log("Retrying...");
                const oldToken = error.response.config.headers['Authorization'].replace('Bearer', '');
                const newToken = keycloak.token;
                if (oldToken !== newToken) {
                    const config = error.config;
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                    return new Promise((resolve, reject) => {
                        instance.request(config).then(response => {
                            resolve(response);
                        }).catch((err) => {
                            reject(err);
                        });
                    });
                } else {
                    console.log('Token is old...rejecting and retrying');
                    return Promise.reject(error);
                }
            } else {
                return Promise.reject(error);
            }
        } else {
            return Promise.reject(error);
        }
    };

    fetchKeycloakToken = async (environment, keycloak) => {
        const instance = axios.create();
        instance.interceptors.response.use(response => {
            return response;
        }, async error => {
            return this.handleError(instance, error, keycloak);
        });

        if (!environment) {
            throw Error("No environment provided");
        }

        const fetchToken = async () => {
            try {
                const tokenResponse = await instance({
                    method: 'GET',
                    url: `/keycloak/${environment.id}/token`,
                    headers: {
                        "Authorization": `Bearer ${keycloak.token}`
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

