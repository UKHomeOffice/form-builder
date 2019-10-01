import React from 'react';
import {useTranslation} from "react-i18next";
import useCommonFormUtils from "../../common/useCommonFormUtils";
import useCreateForm from "../useCreateForm";
import Container from "react-bootstrap/Container";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormBuilderComponent from "../../common/components/FormBuilderComponent";
import useEnvContext from "../../../../core/context/useEnvContext";
import Overlay from "../../../../common/Overlay";
import ConfirmLoadLocalChangesModal from "../../localchanges/components/ConfirmLoadLocalChangesModal";
import {useKeycloak} from "react-keycloak";
import useBeforeUnload from "use-before-unload";
import jwt_decode from "jwt-decode";

const DuplicateFormPage = ({formContent}) => {
    const {envContext} = useEnvContext();
    const {t} = useTranslation();
    const {formChoices} = useCommonFormUtils();
    const {
        backToForms,
        status,
        makeRequest,
        formInvalid,
        form,
        updateField,
        openPreview,
        closePreview,
        changeDisplay,
        updateSchema,
        loadLocalChanges,
        closeDraftModal

    } = useCreateForm(formContent);

    const {keycloak} = useKeycloak();

    useBeforeUnload(evt => {
        const isExpired = jwt_decode(keycloak.refreshToken).exp < new Date().getTime() / 1000;
        return !isExpired;

    });

    return <Container>
        <Row>
            <Col>
                {form.hasUnsavedData ? <Container><Alert variant="warning" className="border-1 mt-2">
                    <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                        <span className="ml-2">{t('form.create.unsaved.data.title')}</span>
                    </Alert.Heading>
                    <p>{t('form.create.unsaved.data.description')}</p>
                </Alert></Container> : null}

                <ConfirmLoadLocalChangesModal
                    loadLocalChanges={loadLocalChanges}
                    openLocalChangesDetectedModal={form.openLocalChangesDetectedModal}
                    closeConfirmLoadLocalChangesModal={closeDraftModal}/>
            </Col>
        </Row>
        <Row>
            <Col>
                <Overlay active={form.reloadingFromLocal} loadingText={"Loading local changes"}
                         children={
                             <FormBuilderComponent
                                 form={form}
                                 duplicate={true}
                                 t={t}
                                 envContext={envContext}
                                 updateField={updateField}
                                 openPreview={openPreview}
                                 closePreview={closePreview}
                                 status={status}
                                 save={makeRequest}
                                 formChoices={formChoices}
                                 messageKeyPrefix={"form.create"}
                                 backToForms={backToForms}
                                 formInvalid={formInvalid}
                                 changeDisplay={changeDisplay}
                                 updateForm={(jsonSchema) => {
                                     updateSchema(jsonSchema);
                                 }}
                             />}/>
            </Col>
        </Row>

    </Container>
};

export default DuplicateFormPage;
