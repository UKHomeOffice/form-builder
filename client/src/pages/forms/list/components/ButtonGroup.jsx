import React from 'react';
import useRoles from "../../common/useRoles";
import useEnvContext from "../../../../core/context/useEnvContext";
import {useTranslation} from "react-i18next";
import DeleteFormButton from "../../common/components/DeleteFormButton";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const ButtonGroup = ({
                         form,
                         handleOnSuccessfulDeletion,
                         handleEditForm,
                         handlePreview,
                         handlePromotion
                     }) => {
    const {canPromote, canEdit} = useRoles();
    const {envContext} = useEnvContext();
    const {t} = useTranslation();
    return <Container>
        <Row className="grid-divider">
            {canEdit() && envContext.editable ? <React.Fragment>
                <Col className="my-1">
                    <DeleteFormButton form={form} onSuccessfulDeletion={() => handleOnSuccessfulDeletion(form.id)}/>
                </Col>
                {canEdit() && envContext.editable ? <React.Fragment>
                    <Col className="my-1">
                        <Button data-cy="edit-form"
                                block variant="primary"
                                size="sm"
                                onClick={() => handleEditForm(form)}>{t('form.edit.label')}</Button>
                    </Col>
                </React.Fragment> : null}
            </React.Fragment> : null}

            <Col className="my-1">
                <Button data-cy="preview-form"
                        block variant="info"
                        size="sm"
                        onClick={() => handlePreview(form)}>{t('form.preview.label')}</Button>
            </Col>
            {canPromote() ? <Col className="my-1">
                <Button data-cy="promote-form"
                        block variant="dark" size="sm"
                        onClick={() => handlePromotion(form)}>{t('form.promote.label')}</Button>
            </Col> : null}
        </Row>
    </Container>


};

export default ButtonGroup;
