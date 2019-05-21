import React from 'react';
import {Container, Divider, Grid, Header, Icon, Loader, Step} from 'semantic-ui-react'
import {EXECUTING} from "../../../../core/api/actionTypes";
import usePromotion from "../usePromotion";
import {useTranslation} from "react-i18next";
import Environment from "./Environment";
import Confirm from "./Confirm";
import FormToPromote from "./FormToPromote";

const FormPromotionPage = ({formId}) => {
    const {fetchState, form, setValue, backToForms, isDisabled, status, execute} = usePromotion(formId);
    const {t} = useTranslation();

    if (!fetchState.status || fetchState.status === EXECUTING ) {
        return <div className="center"><Loader active inline='centered' size='large'>{t('form.loading-form')}</Loader>
        </div>
    }


    const toRender = () => {
        switch (form.step) {
            case 'form' :
                return <FormToPromote form={form} setValue={setValue}
                                      backToForms={backToForms}/>;
            case 'environment':
                return <Environment form={form}
                                    setValue={setValue}
                                    isDisabled={isDisabled}/>;
            case 'confirm' :
                return <Confirm form={form} backToForms={backToForms}
                                setValue={setValue} promote={execute} status={status}/>;
            default:
                return null;
        }
    };

    const steps = <Step.Group widths={3}>
        <Step id="form" link active={form.step === "form"} onClick={(event, titleProps) => {
            setValue(form => ({
                ...form,
                step: titleProps.id
            }));
        }}>
            <Icon name='wordpress forms'/>
            <Step.Content>
                <Step.Title>Form</Step.Title>
            </Step.Content>
        </Step>
        <Step id="environment" link active={form.step === "environment"} onClick={(event, titleProps) => {
            setValue(form => ({
                ...form,
                step: titleProps.id
            }));
        }}>
            <Icon name='settings'/>
            <Step.Content>
                <Step.Title>Environment</Step.Title>
            </Step.Content>
        </Step>
        <Step id="confirm" link disabled={isDisabled()} active={form.step === "confirm"} onClick={(event, titleProps) => {
            setValue(form => ({
                ...form,
                step: titleProps.id
            }));
        }}>
            <Icon name='info'/>
            <Step.Content>
                <Step.Title>Confirm </Step.Title>
            </Step.Content>
        </Step>
    </Step.Group>;

    return <Grid>
        <Grid.Row>
            <Grid.Column>
                <Divider horizontal>
                    <Header as='h4'>
                        <Icon name='move'/>
                        {t('form.promote.header')}
                    </Header>
                </Divider>
                <Container>{steps}</Container>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                {toRender()}
            </Grid.Column>
        </Grid.Row>
    </Grid>


};

export default FormPromotionPage;
