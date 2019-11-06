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
import VersionsPromotionPanel from "./VersionsPromotionPanel";

const FormToPromotePanel = ({form, backToForms, handleSpecificVersion}) => {
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
        {/*<Row>*/}
        {/*    <Col className="mb-2">*/}
        {/*        <Button variant={form.promoteSpecificVersion ? 'info' : 'primary'} onClick={() => {*/}
        {/*            handleSpecificVersion()*/}
        {/*        }}>{form.promoteSpecificVersion ? t('form.promote.latestVersion') : t('form.promote.specificVersion')}</Button>*/}
        {/*    </Col>*/}
        {/*</Row>*/}
        <Row>
            <Col>
                {!form.promoteSpecificVersion ?
                    <Form form={form.data} options={{
                        readOnly: true
                    }}/> : <VersionsPromotionPanel formId={form.formId}/>}
            </Col>
        </Row>
        <Row>
            <Col>
                <ButtonToolbar className="mt-4">
                    <Button block={isMobile} className="mr-2"
                            onClick={() => {
                                backToForms();
                            }}
                            variant="secondary"><FontAwesomeIcon icon={faTimes}/><span
                        className="ml-2">{t('form.cancel.label')}</span></Button>
                    <Button block={isMobile} variant="primary"
                            disabled={!form.data}
                            data-cy="promote-next-env"
                            onClick={() => {
                                form.stepper.next();
                            }}
                            className="mr-2">{t('form.promote.next')}<span className="ml-2"><FontAwesomeIcon
                        icon={faCaretRight}/></span></Button>

                </ButtonToolbar>
            </Col>
        </Row>
    </Container>
};

export default FormToPromotePanel;
