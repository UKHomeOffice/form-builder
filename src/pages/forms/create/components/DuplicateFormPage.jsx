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

const DuplicateFormPage = ({formContent}) => {
    const {t} = useTranslation();
    const {formChoices} = useCommonFormUtils();
    const {
        backToForms,
        status,
        makeRequest,
        formInvalid,
        form,
        setValues,
        updateField,
        openPreview,
        closePreview,
        changeDisplay

    } = useCreateForm(formContent);

    if (!formContent) {
        return <Container>
            <Alert variant="warning" className="border-1 mt-2">
                <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle}/>
                    <span className="ml-2">{t('error.general')}</span>
                </Alert.Heading>
                <p className="lead">{t('form.create.duplicate.no-form-content')}</p>
            </Alert>
        </Container>
    }

    return <Container>
        <Row>
            <Col>
                <FormBuilderComponent
                    duplicate={true}
                    form={form}
                    t={t}
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
                    updateForm={(jsonSchema) =>
                        setValues({
                            ...form,
                            data: Object.assign(jsonSchema, form.data)
                        })
                    }
                />
            </Col>
        </Row>

    </Container>
};

export default DuplicateFormPage;
