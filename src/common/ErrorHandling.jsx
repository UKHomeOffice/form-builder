import React from 'react';
import Container from "react-bootstrap/Container";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import Alert from "react-bootstrap/Alert";
import {withTranslation} from "react-i18next";
import eventEmitter from "../core/eventEmitter";
import {withToastManager} from "react-toast-notifications";
import _ from 'lodash';
import ValidationError from "./ValidationError";
import uuid4 from "uuid4";

class ErrorHandling extends React.Component {
    constructor(props) {
        super(props);
        this.state = {error: false};
    }

    componentDidCatch(error, errorInfo) {
        this.setState({error: true});
    }

    componentDidMount() {
        const {t} = this.props;
        eventEmitter.subscribe('error', (error) => {
            const translateKey = error.translateKey;
            const translateMetaData = error.translateKeyMeta ? error.translateKeyMeta : {};
            if (!_.isEmpty(error.exception)) {
                this.props.toastManager.add(error.exception.message, {
                    appearance: 'error',
                    autoDismiss: false,
                    id: uuid4()
                });
            } else if (!_.isEmpty(error.response)) {
                const validationErrors = error.response.data.validationErrors;
                if (!_.isEmpty(validationErrors)) {
                    this.props.toastManager.add(<ValidationError translateKey={translateKey}
                                                                 validationErrors={validationErrors}/>, {
                        appearance: 'error',
                        autoDismiss: false,
                        id: uuid4()

                    });
                } else {
                    let errorMessage = "";
                    if (error.response.data.message) {
                        errorMessage += error.response.data.message;
                    }

                    if (error.response.data.exception) {
                        errorMessage += error.response.data.exception
                    }

                    if (translateKey) {
                        translateMetaData['error'] = errorMessage;

                        this.props.toastManager.add(<React.Fragment>
                            <h6>{t(translateKey, translateMetaData)}</h6>
                        </React.Fragment>, {
                            appearance: 'error',
                            autoDismiss: false,
                            id: uuid4()

                        });
                    } else {
                        this.props.toastManager.add(<React.Fragment>
                            <h6>{t('error.general')}</h6>
                            <h6>{errorMessage}</h6>
                        </React.Fragment>, {
                            appearance: 'error',
                            autoDismiss: false,
                            id: uuid4()

                        });
                    }
                }

            } else {
                this.props.toastManager.add(`${error.message}`, {
                    appearance: 'error',
                    autoDismiss: false,
                    id: uuid4()
                });
            }
        });
    }

    render() {
        const {t} = this.props;

        if (this.state.error) {
            return <Container><Alert variant="warning" className="mt-5">
                <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                    <span className="ml-2">{t('error.general')}</span>
                </Alert.Heading>
                <p>{t('error.component-error')}</p>
            </Alert></Container>
        }
        return this.props.children
    }
}

export default withTranslation()(withToastManager(ErrorHandling));
