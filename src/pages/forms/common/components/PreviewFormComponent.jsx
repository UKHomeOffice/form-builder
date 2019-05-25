import React, {useEffect, useState, useRef} from 'react';
import {Container, Divider, Grid, Header, Icon, Message, Placeholder} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import useFormDataReplacer from "../../../../core/replacements/useFormDataReplacer";
import ReactJson from "react-json-view";
import {Form} from 'react-formio';
import "formiojs/dist/formio.full.css";

const PreviewFormComponent = ({form, submission, handlePreview}) => {
    const {t} = useTranslation();
    return <Container>
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Message icon
                             warning>
                        <Icon name='exclamation circle'/>
                        <Message.Content>
                            <Message.Header>{t('form.preview.submission-warning-title')}</Message.Header>
                            {t('form.preview.submission-warning-description')}
                        </Message.Content>
                    </Message>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    {form ? <Header
                        as='h2'
                        content={form.title ? form.title : 'No form title'}
                        subheader={form.name ? form.name : 'No form name'}
                        dividing
                    /> : null}
                    <PreviewFormPanel form={form} formSubmission={submission} submissionInfoCollapsed={true}
                                      previewSubmission={(submission) => {
                                          handlePreview(submission)
                                      }}/>
                </Grid.Column>
            </Grid.Row>
        </Grid>

    </Container>
};


const PreviewFormPanel = ({form, formSubmission, previewSubmission, submissionInfoCollapsed = false}) => {

    const {t} = useTranslation();
    const {performFormParse} = useFormDataReplacer();

    const [parsedForm, setParsedForm] = useState({
        isParsing: true,
        form: null

    });

    const parseCallBack = useRef();

    const callback = () => {
        performFormParse(form).then((result) => {
            setParsedForm({
                isParsing: false,
                form: result
            })
        });
    };

    useEffect(() => {
        parseCallBack.current = callback;
    });

    useEffect(() => {
        parseCallBack.current();
    }, [form]);


    if (!form) {
        return null;
    }

    if (parsedForm.isParsing) {
        return <Placeholder fluid>
            <Placeholder.Paragraph>
                <Placeholder.Line length='full'/>
                <Placeholder.Line length='full'/>
                <Placeholder.Line length='full'/>
                <Placeholder.Line length='full'/>
                <Placeholder.Line length='full'/>
            </Placeholder.Paragraph>
        </Placeholder>
    }

    return <React.Fragment>
        <Form form={parsedForm.form} onSubmit={(submission) => previewSubmission(submission)}
              options={
                  {
                      noAlerts: true
                  }}/>
        <Divider horizontal>
            <Header as='h4'>
                <Icon name='database'/>
                {t('form.preview.form-submission-label')}
            </Header>
        </Divider>
        <ReactJson src={formSubmission ? formSubmission : {}} theme="monokai" name={null}
                   collapseStringsAfterLength={100}
                   collapsed={submissionInfoCollapsed}/>

    </React.Fragment>
};

export default PreviewFormComponent;





