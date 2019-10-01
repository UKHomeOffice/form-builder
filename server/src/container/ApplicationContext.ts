import {Container} from 'inversify';
import logger from "../util/logger";
import {EventEmitter} from 'events';
import {ApplicationConstants} from "../constant/ApplicationConstants";
import TYPE from "./TYPE";
import {ProtectMiddleware} from "../middleware/ProtectMiddleware";
import {KeycloakService} from "../auth/KeycloakService";

export class ApplicationContext {
    private readonly container: Container;

    constructor(appConfig) {
        this.container = new Container({
            defaultScope: 'Singleton',

        });

        const eventEmitter = new EventEmitter();
        logger.info('Application context initialised');

        this.container.bind<EventEmitter>(TYPE.EventEmitter).toConstantValue(eventEmitter);
        this.container.bind<any>(TYPE.AppConfig).toConstantValue(appConfig);
        this.container.bind<ProtectMiddleware>(TYPE.ProtectMiddleware).to(ProtectMiddleware);
        this.container.bind<KeycloakService>(TYPE.KeycloakService).to(KeycloakService);

        eventEmitter.on(ApplicationConstants.SHUTDOWN_EVENT, () => {
            this.container.unbindAll();
            logger.info('Container unbindAll activated');
        });
    }

    public get<T>(serviceIdentifier: string | symbol): T {
        return this.container.get(serviceIdentifier);
    }

    public iocContainer(): Container {
        return this.container;
    }
}
