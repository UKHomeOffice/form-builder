import React from 'react';
import {Header, List} from "semantic-ui-react";
import _ from 'lodash';
import useEnvContext from "../../../core/context/useEnvContext";

const EnvironmentListPanel = ({environments}) => {
    const {changeContext} = useEnvContext();
    const handleClick = (environment) => {
        changeContext(environment);
    };

    return <List divided relaxed>
        {
            _.map(environments, (environment) => (
                <List.Item key={environment.id}>
                    <List.Icon name='cog' size='large' verticalAlign='middle'/>
                    <List.Content>
                        <Header as='h5'><a href="#" onClick={() => {
                            handleClick(environment);
                        }}>{environment.label ? environment.label : environment.id}</a></Header>
                        <List.Description>{environment.description}</List.Description>
                    </List.Content>
                </List.Item>
            ))
        }
    </List>
};

export default EnvironmentListPanel;
