import {useNavigation} from "react-navi";
import React from 'react';
import {Button, Divider, Grid, Icon, Message, Segment} from 'semantic-ui-react'
import {useTranslation} from "react-i18next";
import useEnvContext from "../../../../core/context/useEnvContext";

const CreateFormChoice = () => {
    const navigation = useNavigation();
    const {envContext} = useEnvContext();
    const {t} = useTranslation();
    const context = envContext();
    if (!context) {
        return <Message icon negative>
            <Icon name='exclamation circle'  />
            <Message.Content>
                <Message.Header>{t('error.no-context')}</Message.Header>
                {t('error.no-context-message')}
            </Message.Content>
        </Message>
    }
    if (context.editable) {
        return <Segment placeholder>
            <Grid columns={2} relaxed='very' stackable>
                <Grid.Column>
                    <Button content={t('form.create.choice.form-builder-label')} icon="wpforms" size="big"
                            onClick={() => {
                                navigation.navigate(`/forms/${context.id}/create/builder`);
                            }}/>
                </Grid.Column>

                <Grid.Column verticalAlign='middle'>
                    <Button content={t('form.create.choice.form-upload-label')} icon='upload' size='big'
                            onClick={() => {
                                navigation.navigate(`/forms/${context.id}/create/file-upload`);
                            }}/>
                </Grid.Column>
            </Grid>

            <Divider vertical>Or</Divider>
        </Segment>
    } else {
        return <Message icon negative>
            <Icon name='exclamation circle'  />
            <Message.Content>
                <Message.Header>{t('form.create.not-allowed.title')}</Message.Header>
                {t('form.create.not-allowed.message')}
            </Message.Content>
        </Message>
    }


};

export default CreateFormChoice;
