import React from 'react';
import {Divider, Grid, Header, Icon, Segment} from "semantic-ui-react";
import EnvironmentListPanel from "./EnvironmentListPanel";
import ReportsPanel from "./ReportsPanel";
import {useTranslation} from "react-i18next";
import config from "react-global-configuration"


const Home = () => {
    const environments = config.get('environments');
    const {t} = useTranslation();
    return <React.Fragment>
        <Divider horizontal>
            <Header as='h1'>
                <Icon name='dashboard'/>
                {t('home.heading.title')}
            </Header>
        </Divider>
        <Grid>
            <Grid.Row stretched>
                <Grid.Column>
                    <Segment basic>
                        <Divider horizontal>
                            <Header as='h2'>
                                <Icon name='chart line'/>
                                {t('home.reports')}
                            </Header>
                        </Divider>
                        <ReportsPanel/>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
                <Grid.Column>
                    <Segment basic>
                        <Divider horizontal>
                            <Header as='h2'>
                                <Icon name='cogs'/>
                                {t('home.environments')}
                            </Header>
                        </Divider>
                        <EnvironmentListPanel environments={environments}/>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </React.Fragment>
};

export default Home;
