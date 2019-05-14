import React, {useState} from "react";
import {Icon, Message, Modal} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import './PreviewFormModal.scss';
import PreviewFormComponent from "../../common/components/PreviewFormComponent";

const PreviewFormModal = ({form, title, open, onClosePreview}) => {
    const [submission, setSubmission] = useState(null);
    const {t} = useTranslation();

    return <Modal open={open} onClose={onClosePreview} closeOnEscape={true} size="fullscreen" closeIcon>
        {!form ? <Message warning>
                <Message.Header>{t('form.create.preview.modal.missing-form.title')}</Message.Header>
                <p>{t('form.create.preview.modal.missing-form.message')}</p>
            </Message> :
            <React.Fragment>
                <Modal.Header>
                    <Icon name='eye'/>
                    Preview
                </Modal.Header>
                <Modal.Content scrolling>
                    <PreviewFormComponent form={form} submission={submission} handlePreview={(submission) => {
                        setSubmission(submission)
                    }}/>
                </Modal.Content>
            </React.Fragment>
        }
    </Modal>
};

export default PreviewFormModal;
