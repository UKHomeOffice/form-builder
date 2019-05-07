import {useNavigation} from "react-navi";
import React from 'react';
import {Button, Divider, Grid, Segment} from 'semantic-ui-react'
import {useTranslation} from "react-i18next";

const CreateFormChoice = () => {
    const navigation = useNavigation();
    const {t} = useTranslation();
    return <Segment placeholder>
        <Grid columns={2} relaxed='very' stackable>
            <Grid.Column>
                <Button content={t('form.create.choice.form-builder-label')} icon="wpforms" size="big" onClick={() => {
                    navigation.navigate("/forms/create/builder");
                }}/>
            </Grid.Column>

            <Grid.Column verticalAlign='middle'>
                <Button content={t('form.create.choice.form-upload-label')} icon='upload' size='big' onClick={() => {
                    navigation.navigate("/forms/create/file-upload");
                }}/>
            </Grid.Column>
        </Grid>

        <Divider vertical>Or</Divider>
    </Segment>
};

export default CreateFormChoice;
