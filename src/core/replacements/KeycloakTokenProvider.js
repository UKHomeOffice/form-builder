import axios from "axios";


export class KeycloakTokenProvider {
    constructor() {
        this.getToken = this.getToken.bind(this);
    }

    getToken = async (environment) => {
        const keycloakService = environment.service.keycloak;
        if (!keycloakService) {
            return null;
        }
        const tokenResponse = await axios({
            method: 'POST',
            url: `${keycloakService.tokenUrl}`,
            auth: {
                username: keycloakService.clientId,
                password: keycloakService.secret
            },
            withCredentials: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "grant_type=client_credentials"
        });
        if (tokenResponse.status !== 200) {
            return Error("Failed to get access token");
        }
        return tokenResponse.data.access_token;
    };
}

