import React from "react";
import {Icon, Modal} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import ReactJson from "react-json-view";

const SchemaModal = ({form, open, close}) => {
    const {t} = useTranslation();

        return <Modal open={open} onClose={close} closeOnEscape={true} closeIcon>
        <Modal.Header>
            <Icon name='code'/>
            {t('form.schema.label')}
        </Modal.Header>
        <Modal.Content scrolling>
            <ReactJson src={form ? form : {}} theme="monokai" name={null}
                       collapseStringsAfterLength={100}
                       collapsed={2}/>
        </Modal.Content>
    </Modal>
};

export default SchemaModal;
