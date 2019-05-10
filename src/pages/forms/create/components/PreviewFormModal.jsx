import PreviewFormPanel from "../../preview/components/PreviewFormPanel";
import React, {useState} from "react";
import {Message, Modal} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import './PreviewFormModal.scss';

const PreviewFormModal = ({form, title, open, onClosePreview}) => {
    const [submission, setSubmission] = useState(null);
    const {t} = useTranslation();

    return <Modal open={open} onClose={onClosePreview} closeOnEscape={true} size="fullscreen">
        {!form ? <Message warning>
                <Message.Header>{t('form.create.preview.modal.missing-form.title')}</Message.Header>
                <p>{t('form.create.preview.modal.missing-form.message')}</p>
            </Message> :
            <React.Fragment><Modal.Header>{!form.title ? t('form.create.preview.modal.missing-title') : form.title}</Modal.Header>
                <Modal.Content scrolling>

                    <PreviewFormPanel form={form} formSubmission={submission} submissionInfoCollapsed={true}
                                      previewSubmission={(submission) => {
                                          setSubmission(submission)
                                      }}/>
                </Modal.Content></React.Fragment>}
    </Modal>
};

export default PreviewFormModal;
