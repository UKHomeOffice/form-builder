import React from 'react';
import {
    Accordion,
    Button,
    Container,
    Dimmer,
    Grid,
    Icon,
    Input,
    Item,
    Label,
    Loader,
    Message,
    Pagination,
    Segment,
    Statistic,
    Table
} from 'semantic-ui-react'
import useGetForms from "../useGetForms";
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import "../../common/components/FormBuilderComponent.scss"
import {useTranslation} from "react-i18next";
import useEnvContext from "../../../../core/context/useEnvContext";
import DeleteFormButton from "../../common/components/DeleteFormButton";
import _ from 'lodash';
import moment from "moment";

const FormList = ({env}) => {
    const {
        handleSort,
        forms,
        navigation,
        status,
        response,
        handlePaginationChange,
        handleTitleSearch,
        handleOnSuccessfulDeletion,
        handlePreview,
        handleEditForm,
        handleAccordionClick,
        download,
        downloadFormState,
        handlePromotion
    } = useGetForms(env);

    const {t} = useTranslation();
    const {envContext} = useEnvContext();

    const {direction, column, data, total, activePage, limit} = forms;
    if (status === ERROR) {
        return <Container><Message icon negative>
            <Icon name='warning circle'/>
            <Message.Content>
                <Message.Header>{t('error.general')}</Message.Header>
                {t('form.list.failure.forms-load', {error: response ? JSON.stringify(response.data) : t('form.list.failure.unknown-error')})}
            </Message.Content>
        </Message></Container>
    }
    const isLoading = !status || status === EXECUTING || downloadFormState.status === EXECUTING;

    return <Container>
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Segment raised>
                        <Statistic.Group widths='three'>
                            <Statistic horizontal>
                                <Statistic.Value>
                                    {forms.numberOfForms + forms.numberOfWizards}
                                </Statistic.Value>
                                <Statistic.Label>{t('form.list.total-forms', {env: envContext.label})}</Statistic.Label>
                            </Statistic>
                            <Statistic horizontal>
                                <Statistic.Value>{forms.numberOfForms}</Statistic.Value>
                                <Statistic.Label>{t('form.list.total-form-type')}</Statistic.Label>
                            </Statistic>
                            <Statistic horizontal>
                                <Statistic.Value>{forms.numberOfWizards}</Statistic.Value>
                                <Statistic.Label>{t('form.list.total-wizard-type')}</Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Input data-cy="search-title" icon='search'
                           name="search-title"
                           placeholder={t('form.list.search-label')}
                           size='large'
                           onChange={handleTitleSearch}
                           fluid focus/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Dimmer.Dimmable blurring dimmed={isLoading}>
                        <Dimmer active={isLoading} inverted>
                            <Loader active inline='centered' size='large'>{t('form.list.loading')}</Loader>
                        </Dimmer>
                        <Table columns={4} sortable stackable data-cy="forms-table">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell sorted={column === 'title' ? direction : null}
                                                      onClick={
                                                          handleSort('title')}
                                                      width={10}>{t('form.list.table.formTitleCellLabel')}</Table.HeaderCell>
                                    <Table.HeaderCell sorted={column === 'name' ? direction : null}
                                                      onClick={handleSort('name')}>{t('form.list.table.formNameCellLabel')}</Table.HeaderCell>
                                    <Table.HeaderCell sorted={column === 'display' ? direction : null}
                                                      onClick={handleSort('display')}>{t('form.list.table.formTypeCellLabel')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('form.list.table.formActionsCellLabel')}</Table.HeaderCell>

                                </Table.Row>
                            </Table.Header>

                            <Table.Body data-cy="form-table-data">
                                {_.map(data, (form, index) => (
                                    <Table.Row key={form._id}>
                                        <Table.Cell>
                                            <Accordion>
                                                <Accordion.Title active={forms.activeIndex === index} index={index}
                                                                 onClick={handleAccordionClick}>
                                                    <Icon name='dropdown'/>
                                                    {form.title}
                                                </Accordion.Title>
                                                <Accordion.Content active={forms.activeIndex === index}>
                                                    <Item.Group>
                                                        <Item>
                                                            <Item.Content>
                                                                <Item.Meta>Identifier: {form._id}</Item.Meta>
                                                                <Item.Meta>Path: {form.path}</Item.Meta>
                                                                <Item.Extra>
                                                                    {envContext.editable ?
                                                                        <Button circular size='mini' primary
                                                                                icon="download"
                                                                                onClick={(event) => download(form._id, form.name)}/> : null}
                                                                    <Label
                                                                        size="medium">Created {moment(form.created).fromNow()}</Label>
                                                                    <Label
                                                                        size="medium">Updated {moment(form.modified).fromNow()}</Label>
                                                                </Item.Extra>
                                                            </Item.Content>
                                                        </Item>
                                                    </Item.Group>
                                                </Accordion.Content>
                                            </Accordion>
                                        </Table.Cell>
                                        <Table.Cell>{form.name}</Table.Cell>
                                        <Table.Cell>{form.display ? form.display : 'form'}</Table.Cell>
                                        <Table.Cell>
                                            <Button.Group>
                                                <DeleteFormButton form={form}
                                                                  onSuccessfulDeletion={() => handleOnSuccessfulDeletion(form._id)}/>
                                                <Button.Or/>
                                                <Button data-cy="edit-form" positive
                                                        onClick={() => handleEditForm(form)}>{t('form.edit.label')}</Button>
                                                <Button.Or/>
                                                <Button primary
                                                        onClick={() => handlePreview(form)}>{t('form.preview.label')}</Button>
                                                <Button.Or/>
                                                <Button secondary
                                                        onClick={() => handlePromotion(form)}>{t('form.promote.label')}</Button>
                                            </Button.Group>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan={1}>{total} forms</Table.HeaderCell>
                                    {total > limit ? <Table.HeaderCell colSpan={2}>
                                        <Pagination totalPages={Math.ceil(parseInt(total) / limit)}
                                                    activePage={activePage}
                                                    ellipsisItem={{
                                                        content: <Icon name='ellipsis horizontal'/>,
                                                        icon: true
                                                    }}
                                                    firstItem={{
                                                        content: <Icon name='angle double left'/>,
                                                        icon: true
                                                    }}
                                                    lastItem={{
                                                        content: <Icon name='angle double right'/>,
                                                        icon: true
                                                    }}
                                                    prevItem={{content: <Icon name='angle left'/>, icon: true}}
                                                    nextItem={{content: <Icon name='angle right'/>, icon: true}}
                                                    onPageChange={handlePaginationChange}/>
                                    </Table.HeaderCell> : <Table.HeaderCell/>}
                                    <Table.HeaderCell colSpan={2}>
                                        <Button floated='right' icon labelPosition='left' primary size='small'
                                                onClick={() => navigation.navigate(`/forms/${envContext.id}/create`)} data-cy="create-form">
                                            <Icon name='wpforms'/>{t('form.create.label')}
                                        </Button>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Dimmer.Dimmable>
                </Grid.Column>
            </Grid.Row>
        </Grid>

    </Container>
};


export default FormList;
