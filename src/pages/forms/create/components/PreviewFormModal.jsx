import PreviewFormPanel from "../../preview/components/PreviewFormPanel";
import React, {useState} from "react";
import {Modal} from "semantic-ui-react";
import {useTranslation} from "react-i18next";

const PreviewFormModal = ({form, title, open, onClosePreview}) => {
    const [submission, setSubmission] = useState(null);
    const {t} = useTranslation();

    return <Modal open={open} onClose={onClosePreview} closeOnEscape={true} size="large">
        <Modal.Header>{title ? title : t('form.create.preview.modal.missing-title')}</Modal.Header>
        <Modal.Content scrolling>
            <PreviewFormPanel form={form} formSubmission={submission} submissionInfoCollapsed={true}
                              previewSubmission={(submission) => {
                                  setSubmission(submission)
                              }}/>
        </Modal.Content>
    </Modal>
};

export default PreviewFormModal;
