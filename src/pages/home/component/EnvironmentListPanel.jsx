import React, {useContext} from 'react';
import {Item, Label} from "semantic-ui-react";
import _ from 'lodash';
import useEnvContext from "../../../core/context/useEnvContext";
import {useNavigation} from "react-navi";
import {ApplicationContext} from "../../../core/Main";
import {useTranslation} from "react-i18next";

const EnvironmentListPanel = ({environments}) => {
    const {changeContext} = useEnvContext();
    const navigation = useNavigation();
    const {setState} = useContext(ApplicationContext);
    const {t} = useTranslation();


    const handleClick = (environment) => {
        setState(state => ({
            ...state,
            activeMenuItem: t('menu.forms')
        }));
        changeContext(environment);
        navigation.navigate(`/forms/${environment.id}`, {replace: true});
    };

    return <Item.Group divided relaxed link>
        {
            _.map(environments, (environment) => (
                <Item onClick={() => {
                    handleClick(environment);
                }} key={environment.id}>
                    <Item.Image size='tiny' src="/cog-solid.svg" />
                    <Item.Content>
                        <Item.Header as="a">{environment.label ? environment.label : environment.id}</Item.Header>
                        <Item.Description>{environment.description}</Item.Description>
                        <Item.Extra>
                            <Label color={environment.editable? 'teal': 'red'}>{t('environment.create', {editable: environment.editable ? t('yes') : t('no')})}</Label>
                            <Label icon='globe' content={t('environment.url', {url: environment.url})} />
                        </Item.Extra>

                    </Item.Content>
                </Item>
            ))
        }
    </Item.Group>
};

export default EnvironmentListPanel;
