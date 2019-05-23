import React from 'react';
import {Button, Container, Grid, Icon, Item, Radio} from "semantic-ui-react";
import useEnvContext from "../../../../core/context/useEnvContext";
import _ from "lodash";
import uuid4 from "uuid4";
import {useTranslation} from "react-i18next";

const Environment = ({form, setValue, isDisabled}) => {
    const {availableEnvironments, envContext} = useEnvContext();
    const {t} = useTranslation();
    const handleChange = (e, props) => {
        setValue(form => ({
            ...form,
            environment: props.value === form.environment ? null : props.value
        }));
    };

    return <React.Fragment>
        <Container>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Grid columns={3} divided>
                            {
                                _.map(_.chunk(availableEnvironments(envContext.id), 3), (environments) => {
                                    return <Grid.Row key={uuid4()}>
                                        {
                                            _.map(environments, (environment) => {
                                                return <Grid.Column key={uuid4()}>
                                                    <Item.Group divided relaxed key={uuid4()}>
                                                        <Item key={environment.id}>
                                                            <Item.Image size='tiny' src="/cog-solid.svg"/>
                                                            <Item.Content>
                                                                <Item.Header
                                                                    as="a">{environment.label ? environment.label : environment.id}</Item.Header>
                                                                <Item.Description>
                                                                    <Radio
                                                                        toggle
                                                                        name='environmentGroup'
                                                                        value={environment.id}
                                                                        checked={form.environment === environment.id}
                                                                        onChange={handleChange}
                                                                        label={t('form.promote.environment', {env: environment.label})}
                                                                    />
                                                                </Item.Description>
                                                            </Item.Content>
                                                        </Item>
                                                    </Item.Group>
                                                </Grid.Column>
                                            })
                                        }
                                    </Grid.Row>
                                })
                            }
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign="right">
                        <Button size='large' secondary icon labelPosition='left' onClick={() => {
                            setValue(form => ({
                                ...form,
                                step: "form"
                            }));
                        }}>
                            <Icon name='left arrow'/>
                            {t('form.promote.previous')}

                        </Button>
                        <Button disabled={isDisabled()} size='large' primary icon labelPosition='right' onClick={() => {
                            setValue(form => ({
                                ...form,
                                step: "confirm"
                            }));
                        }}>
                            {t('form.promote.next')}
                            <Icon name='right arrow'/>
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    </React.Fragment>;
};

export default Environment;