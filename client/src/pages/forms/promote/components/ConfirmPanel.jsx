import React from 'react';
import {useTranslation} from "react-i18next";
import useEnvContext from "../../../../core/context/useEnvContext";
import {EXECUTING} from "../../../../core/api/actionTypes";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {isMobile} from "react-device-detect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretLeft, faTimes, faCheck} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import _ from 'lodash';

const ConfirmPanel = ({form, setValue, backToForms, promote, status}) => {
    const {t} = useTranslation();
    const {getEnvDetails} = useEnvContext();
    if (!form.data) {
        return null;
    }

    const environment = getEnvDetails(form.environment);
    if (!environment) {
        return null;
    }
    return <Container>
        <Row>
            <Col>
                <hr className="hr-text" data-content={t('form.promote.confirm')} />
            </Col>
        </Row>
        <Row>
            <Col>
                <Table bordered responsive>
                    <thead>
                    <tr>
                        <th>Version Id</th>
                        <th>Title</th>
                        <th>Name</th>
                        <th>Path</th>
                        <th>Environment</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{form.data.versionId}</td>
                        <td>{form.data.title}</td>
                        <td>{form.data.name}</td>
                        <td>{form.data.path}</td>
                        <td><Badge variant={environment.editable ? 'info' : 'danger'}>{_.capitalize(environment.label)}</Badge></td>
                    </tr>
                    </tbody>
                </Table>
            </Col>
        </Row>
        <Row>
            <Col>
                <ButtonToolbar className="mt-5">
                    <Button block={isMobile} className="mr-2"
                            onClick={() => {
                                form.stepper.previous();
                            }}
                            variant="secondary"><FontAwesomeIcon icon={faCaretLeft}/><span
                        className="ml-2">{t('form.promote.previous')}</span></Button>
                    <Button block={isMobile} className="mr-2"
                            onClick={() => {
                                backToForms()
                            }}
                            variant="dark"><FontAwesomeIcon icon={faTimes}/><span
                        className="ml-2">{t('form.cancel.label')}</span></Button>
                    <Button block={isMobile} variant="primary"
                            data-cy={"promotion-confirm"}
                            disabled={status === EXECUTING}
                            onClick={() => {
                                promote()
                            }}
                            className="mr-2"><FontAwesomeIcon icon={faCheck}/><span className="ml-2">{status === EXECUTING ? t('form.promote.promoting-label') : t('form.promote.promote-action')}</span></Button>

                </ButtonToolbar>
            </Col>
        </Row>
    </Container>
};

export default ConfirmPanel;
