import React from "react";
import useMigrations from "../useMigrations";
import {Checkbox, Container, Image, List} from "semantic-ui-react";
import {useTranslation} from "react-i18next";

const MigrationPage = () => {
    const {} = useMigrations();
    const {t} = useTranslation();
    return <Container>
        <div style={{marginTop: '100px'}}>
            <div style={{textAlign: 'right'}}><Checkbox label={t('migration.migration-all-button-label')}
                           toggle/></div>
            <List divided verticalAlign='middle'>
                <List.Item>
                    <List.Content floated='right'>
                        <Checkbox label={t('migration.migration-button-label')} toggle/>
                    </List.Content>
                    <Image avatar src='https://react.semantic-ui.com/images/avatar/small/lena.png'/>
                    <List.Content>Lena</List.Content>
                </List.Item>
                <List.Item>l
                    <List.Content floated='right'>
                        <Checkbox label={t('migration.migration-button-label')} toggle/>
                    </List.Content>
                    <Image avatar src='https://react.semantic-ui.com/images/avatar/small/lindsay.png'/>
                    <List.Content>Lindsay</List.Content>
                </List.Item>
                <List.Item>
                    <List.Content floated='right'>
                        <Checkbox label={t('migration.migration-button-label')} toggle/>
                    </List.Content>
                    <Image avatar src='https://react.semantic-ui.com/images/avatar/small/mark.png'/>
                    <List.Content>Mark</List.Content>
                </List.Item>
                <List.Item>
                    <List.Content floated='right'>
                        <Checkbox label={t('migration.migration-button-label')} toggle/>
                    </List.Content>
                    <Image avatar src='https://react.semantic-ui.com/images/avatar/small/molly.png'/>
                    <List.Content>Molly</List.Content>
                </List.Item>
            </List></div>

    </Container>
};

export default MigrationPage;
