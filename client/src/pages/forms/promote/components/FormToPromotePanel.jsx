import React from 'react';
import {Form} from 'react-formio';
import "formiojs/dist/formio.full.css";
import {useTranslation} from "react-i18next";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {isMobile} from "react-device-detect";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
   faCaretRight,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";

const FormToPromotePanel = ({form, backToForms}) => {
    const {t} = useTranslation();
    if (!form) {
        return null;
    }
    return <Container>
        <Row>
            <Col>
                <hr className="hr-text" data-content="Form to promote"/>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form form={form.data} options={{
                    readOnly: true
                }}/>
            </Col>
        </Row>
        <Row>
            <Col>
                <ButtonToolbar className="mt-4">
                    <Button block={isMobile} className="mr-2"
                            onClick={() => {
                                backToForms();
                            }}
                            variant="secondary"><FontAwesomeIcon icon={faTimes}/><span className="ml-2">{t('form.cancel.label')}</span></Button>
                    <Button block={isMobile} variant="primary"
                            data-cy="promote-next-env"
                            onClick={() => {
                                form.stepper.next();
                            }}
                            className="mr-2">{t('form.promote.next')}<span className="ml-2"><FontAwesomeIcon icon={faCaretRight}/></span></Button>

                </ButtonToolbar>
            </Col>
        </Row>
    </Container>
};

export default FormToPromotePanel;
