import axios from "axios";


export class KeycloakTokenProvider {
    constructor() {
        this.getToken = this.getToken.bind(this);
    }

    getToken = async (environment, token) => {
        if (!environment) {
            throw Error("No environment provided");
        }
        if (!token) {
            throw Error("No token provided");
        }
        const tokenResponse = await axios({
            method: 'GET',
            url: `/keycloak/${environment.id}/token`,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (tokenResponse.status !== 200) {
            return Error("Failed to get access token");
        }
        return tokenResponse.data.access_token;
    };
}

