import secureLS from "../storage";
import jwt_decode from "jwt-decode";
import axios from "axios";

class FormioTokenProvider {
    constructor() {
        this.fetchToken = this.fetchToken.bind(this);
    }

    fetchToken = async (envContext, token) => {
        const key = `formio-jwt-${envContext.id}`;
        const jwtTokenFromSecureLS = secureLS.get(key);

        const getFormioToken = async (envContext, keycloakToken) => {
            try {
                const tokenResponse = await axios({
                    url: `/formio/${envContext.id}/token`,
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${keycloakToken}`,
                        "Content-Type": "application/json"
                    }
                });
                return tokenResponse.data['x-jwt-token'];
            } catch (e) {
                throw new Error("Failed to get formio token from environment: "+ envContext.id);
            }
        };

        let formioToken;
        if (!jwtTokenFromSecureLS) {
            formioToken = await getFormioToken(envContext, token);
            secureLS.set(key, formioToken);
        } else {
            if (jwt_decode(jwtTokenFromSecureLS).exp < new Date().getTime() / 1000) {
                formioToken = await getFormioToken(envContext, token);
                secureLS.set(key, formioToken);
            } else {
                formioToken = jwtTokenFromSecureLS;
            }
        }
        return formioToken;
    }
}

export default FormioTokenProvider;
