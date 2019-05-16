import {useNavigation} from "react-navi";
import React from 'react';
import {Button, Container, Divider, Grid,  Segment} from 'semantic-ui-react'
import {useTranslation} from "react-i18next";
import useEnvContext from "../../../../core/context/useEnvContext";
import  uuid4 from "uuid4";

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

    return <Container><Segment placeholder size="large" color="teal" raised>
        <Grid columns={2} relaxed='very' stackable>
            <Grid.Column>
                <Button primary content={t('form.create.choice.form-builder-label')} icon="wpforms" size="big"
                        onClick={() => {
                            navigation.navigate(`/forms/${envContext.id}/create/builder`);
                        }}/>
            </Grid.Column>

            <Grid.Column verticalAlign='middle'>
                <Button
                    as="label"
                    htmlFor={id}
                    secondary content={t('form.create.choice.form-upload-label')} icon='upload' size='big'
                        />
                <input
                    hidden
                    id={id}
                    multiple
                    type="file"
                    accept='.json'
                    onChange={(event) =>handleFileChosen(event.target.files[0])} />
            </Grid.Column>
        </Grid>

        <Divider vertical>Or</Divider>
    </Segment></Container>

};

export default CreateFormChoice;
