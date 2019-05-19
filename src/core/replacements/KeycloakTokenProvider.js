import axios from "axios";


export class KeycloakTokenProvider {
    constructor() {
        this.getToken = this.getToken.bind(this);
    }

    getToken = async (environment) => {
        const tokenResponse = await axios({
            method: 'GET',
            url: `/keycloak-token/${environment.id}`,
        });
        if (tokenResponse.status !== 200) {
            return Error("Failed to get access token");
        }
        return tokenResponse.data.access_token;
    };
}

