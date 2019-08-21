import {useNavigation} from "react-navi";
import React from 'react';
import {useTranslation} from "react-i18next";
import useEnvContext from "../../../../core/context/useEnvContext";
import uuid4 from "uuid4";
import Row from "react-bootstrap/Row";
import Jumbotron from "react-bootstrap/Jumbotron";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
   faUpload
} from "@fortawesome/free-solid-svg-icons";
import {faWpforms} from '@fortawesome/free-brands-svg-icons'

const CreateFormChoice = () => {
    const navigation = useNavigation();
    const {envContext} = useEnvContext();
    const {t} = useTranslation();
    const id = uuid4();

    let fileReader;

    const handleFileRead = (e) => {
        const content = fileReader.result;
        navigation.navigate(`/forms/${envContext.id}/create/file-upload`, {
            body: content,
            replace: true
        })
    };

    const handleFileChosen = (file) => {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    };

    return <Container>
        <Jumbotron style={{marginTop:'1rem'}}>
            <h4 className="text-center">{t('form.create.choice.label')}</h4>
            <div style={{marginBottom: '2rem'}} />
            <Container>
                <Row className="grid-divider">
                    <Col>
                        <Button
                            className="float-right"
                            data-cy="form-builder"
                            variant="primary"
                            size="lg"
                            onClick={() => {
                                navigation.navigate(`/forms/${envContext.id}/create/builder`);
                            }}><FontAwesomeIcon icon={faWpforms}/><span className="m-2">{t('form.create.choice.form-builder-label')}</span></Button>
                    </Col>
                    <Col>
                                   <Button
                                        variant="secondary"
                                        as="label"
                                        htmlFor={id}
                                        size='lg'
                                            >
                                       <FontAwesomeIcon icon={faUpload}/><span className="m-2">{t('form.create.choice.form-upload-label')}</span>
                                    <input
                                        data-cy="file-upload-input"
                                        hidden
                                        id={id}
                                        multiple={false}
                                        type="file"
                                        accept='.json'
                                        onChange={(event) => handleFileChosen(event.target.files[0])} />
                                   </Button>
                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    </Container>

    // return <Container><Segment placeholder size="large" color="teal" raised>
    //     <Grid columns={2} relaxed='very' stackable>
    //         <Grid.Column>
    //             <Button
    //                 data-cy="form-builder"
    //                 primary content={t('form.create.choice.form-builder-label')} icon="wpforms" size="big"
    //                     onClick={() => {
    //                         navigation.navigate(`/forms/${envContext.id}/create/builder`);
    //                     }}/>
    //         </Grid.Column>
    //
    //         <Grid.Column verticalAlign='middle'>
    //             <Button
    //                 as="label"
    //                 htmlFor={id}
    //                 secondary content={t('form.create.choice.form-upload-label')} icon='upload' size='big'
    //                     />
    //             <input
    //                 data-cy="file-upload-input"
    //                 hidden
    //                 id={id}
    //                 multiple={false}
    //                 type="file"
    //                 accept='.json'
    //                 onChange={(event) =>handleFileChosen(event.target.files[0])} />
    //         </Grid.Column>
    //     </Grid>
    //
    //     <Divider vertical>Or</Divider>
    // </Segment></Container>

};

export default CreateFormChoice;
