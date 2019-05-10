import React from 'react';
import {Divider, Grid, Header, Icon, Segment} from "semantic-ui-react";
import EnvironmentListPanel from "./EnvironmentListPanel";
import ReportsPanel from "./ReportsPanel";
import {useTranslation} from "react-i18next";
import environments from "../../../environments";


const Home = () => {
    const {t} = useTranslation();
    return <React.Fragment>
        <Grid.Row>
            <Grid padded columns='equal' divided>
                <Grid.Column centered>
                    <Divider horizontal>
                        <Header as='h1'>
                            <Icon name='dashboard'/>
                            {t('home.heading.title')}
                        </Header>
                    </Divider>
                </Grid.Column>
            </Grid>
        </Grid.Row>
        <Grid.Row>
            <Grid padded columns='equal' divided celled>
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
                <Grid.Column>
                    <Segment basic>
                        <Divider horizontal>
                            <Header as='h2'>
                                <Icon name='bar chart'/>
                                {t('home.reports')}
                            </Header>
                        </Divider>
                        <ReportsPanel/>
                    </Segment>
                </Grid.Column>
            </Grid>
        </Grid.Row>
    </React.Fragment>
};

export default Home;
