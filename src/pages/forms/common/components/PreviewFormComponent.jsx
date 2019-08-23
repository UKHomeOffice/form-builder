import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from "react-i18next";
import useFormDataReplacer from "../../../../core/replacements/useFormDataReplacer";
import ReactJson from "react-json-view";
import {Form} from 'react-formio';
import './PreviewFormComponent.scss';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretRight, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import Alert from "react-bootstrap/Alert";
import Collapse from "react-bootstrap/Collapse";
import Spinner from "react-bootstrap/Spinner";

const PreviewFormComponent = ({form, submission, handlePreview}) => {
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const cursor = {cursor: 'pointer'};

    return <Container>
        <Row>
            <Col>
                <Alert variant="warning">
                    <Alert.Heading><FontAwesomeIcon icon={faExclamationTriangle}/>
                        <span className="m-2" style={cursor} onClick={() => {
                            setOpen(!open)
                        }}><FontAwesomeIcon
                            icon={!open ? faCaretRight : faCaretDown}/></span>
                        <span className="m-0" style={cursor} onClick={() => {
                            setOpen(!open)
                        }}>
                           {t('form.preview.submission-warning-title')}
                        </span>
                    </Alert.Heading>
                    <Collapse in={open}>
                        <div id="collapse-text">
                            <p class="lead">{t('form.preview.submission-warning-description')}</p>
                        </div>
                    </Collapse>
                </Alert>
            </Col>
        </Row>
        <Row>
            <Col>
                {
                    form? <React.Fragment>
                        <h2>
                            {form.title ? form.title : 'No form title'}
                            <span className="m-2"><small className="text-muted">{form.name ? form.name : 'No form name'}</small></span>
                        </h2>
                    </React.Fragment> : null
                }
            </Col>
        </Row>
        <Row>
            <Col>
                <PreviewFormPanel form={form} formSubmission={submission} submissionInfoCollapsed={true}
                                                   previewSubmission={(submission) => {
                                                       handlePreview(submission)
                                                   }}/>
            </Col>
        </Row>
    </Container>
};


export const PreviewFormPanel = ({form, formSubmission, previewSubmission, submissionInfoCollapsed = false}) => {

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
        return <div className="center-context">
            <Spinner animation="border" role="status"/>
        </div>
    }

    return <React.Fragment>
        <Form form={parsedForm.form} onSubmit={(submission) => previewSubmission(submission)}
              options={
                  {
                      ignoreCache: true,
                      noAlerts: true,
                      formio: {}
                  }}/>
        <div className="hr-text mb-2" data-content={t('form.preview.form-submission-label')} />

        <ReactJson src={formSubmission ? formSubmission : {}} theme="monokai" name={null}
                   collapseStringsAfterLength={100}
                   collapsed={submissionInfoCollapsed}/>

    </React.Fragment>
};

export default PreviewFormComponent;





