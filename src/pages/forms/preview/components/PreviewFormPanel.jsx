import React from 'react';

import {Divider, Header, Icon} from "semantic-ui-react";
import ReactJson from "react-json-view";
import {useTranslation} from "react-i18next";
import {Form, Formio} from 'react-formio';
import "formiojs/dist/formio.full.css";

Formio.Templates.framework = 'semantic';

const PreviewFormPanel = ({form, formSubmission, previewSubmission, submissionInfoCollapsed = false}) => {
    const {t} = useTranslation();
    return <React.Fragment>
        <Form form={form} onSubmit={(submission) => previewSubmission(submission)} options={
            {
                noAlerts: true
            }}/>
        {form ? <React.Fragment><Divider horizontal>
                <Header as='h4'>
                    <Icon name='database'/>
                    {t('form.preview.form-submission-label')}
                </Header>
            </Divider>
                <ReactJson src={formSubmission ? formSubmission : {}} theme="monokai" name={null}
                           collapseStringsAfterLength={150}
                           collapsed={submissionInfoCollapsed}/></React.Fragment>
            : null}
    </React.Fragment>
};

export default PreviewFormPanel;
