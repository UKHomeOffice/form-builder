import axios from "axios";
import qs from 'querystring';
import config from 'react-global-configuration';

class KeycloakTokenProvider {

    constructor(config) {
        this.config = config;
    }

    handleError = async (instance, error, keycloak) => {
        const keycloakConfig = this.config.get('keycloak');
        if (error.response) {
            if ((error.response.status === 403 || error.response.status === 401)) {
                console.log("Retrying..." + error.response.status);
                let response;
                try {
                    response = await axios({
                        method: 'POST',
                        url: `${keycloakConfig.authUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: qs.stringify({
                            grant_type: 'refresh_token',
                            client_id: keycloakConfig.clientId,
                            refresh_token: keycloak.refreshToken
                        })
                    });
                } catch (e) {
                    console.error(e);
                }
                console.log("Got new token");
                const token = response.data.access_token;
                const config = error.config;
                config.headers['Authorization'] = `Bearer ${token}`;
                return new Promise((resolve, reject) => {
                    instance.request(config).then(response => {
                        resolve(response);
                    }).catch((err) => {
                        reject(err);
                    });
                });
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
                const keycloakConfig = this.config.get('keycloak');

                const accessToken = await axios({
                    method: 'POST',
                    url: `${keycloakConfig.authUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: qs.stringify({
                        grant_type: 'refresh_token',
                        client_id: keycloakConfig.clientId,
                        refresh_token: keycloak.refreshToken
                    })
                });

                const tokenResponse = await instance({
                    method: 'GET',
                    url: `/keycloak/${environment.id}/token`,
                    headers: {
                        "Authorization": `Bearer ${accessToken.data.access_token}`
                    }
                });
                if (tokenResponse.status !== 200) {
                    return Promise.reject(Error("Failed to get access token"));
                }
                return tokenResponse.data.access_token;
            } catch (e) {
                throw new Error("Failed to get keycloak token from environment: "
                    + environment.id + " e: " + e.message);
            }

        };
        return await fetchToken();
    };
}

const keycloakTokenProvider = new KeycloakTokenProvider(config);

export default keycloakTokenProvider;

