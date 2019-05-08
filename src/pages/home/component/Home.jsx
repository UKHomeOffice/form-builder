import React from 'react';
import {Divider, Header, Icon, Segment} from "semantic-ui-react";
import EnvironmentListPanel from "./EnvironmentListPanel";
import ReportsPanel from "./ReportsPanel";
import {useTranslation} from "react-i18next";
import environments from "../../../environments";


const Home = () => {
    const {t} = useTranslation();
    return <React.Fragment>
        <Segment basic>
            <Divider horizontal>
                <Header as='h2'>
                    <Icon name='cogs'/>
                    {t('home.environments')}
                </Header>
            </Divider>
            <EnvironmentListPanel environments={environments}/>
        </Segment>
        <Segment basic>
            <Divider horizontal>
                <Header as='h2'>
                    <Icon name='bar chart'/>
                    {t('home.reports')}
                </Header>
            </Divider>
            <ReportsPanel/>
        </Segment>
    </React.Fragment>
};

export default Home;
