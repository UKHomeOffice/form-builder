import {RequestHandler} from 'express';
import {provide} from 'inversify-binding-decorators';
import Keycloak from 'keycloak-connect';

import {inject} from 'inversify';
import TYPE from '../container/TYPE';
import axios from 'axios';
import _ from 'lodash';


@provide(TYPE.KeycloakService)
export class KeycloakService {

    private readonly keycloak: Keycloak;

    constructor(@inject(TYPE.AppConfig) private readonly appConfig: any) {
        this.keycloak = new Keycloak({}, {
            clientId: this.appConfig['keycloak'].clientId,
            serverUrl: this.appConfig['keycloak'].authUrl,
            realm: this.appConfig['keycloak'].realm,
            bearerOnly: true,
        });
    }


    public middleware(): RequestHandler {
        return this.keycloak.middleware();
    }

    public protect(): RequestHandler {
        return this.keycloak.protect();
    }

    public async token(env: string): Promise<string> {
        const environment = _.find(this.appConfig.environments, {id: env});
        const tokenResponse = await axios({
            method: 'POST',
            url: `${environment.service.keycloak.tokenUrl}`,
            auth: {
                username: environment.service.keycloak.clientId,
                password: environment.service.keycloak.secret
            },
            withCredentials: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'grant_type=client_credentials'
        });
        return tokenResponse.data.access_token;
    }

}
