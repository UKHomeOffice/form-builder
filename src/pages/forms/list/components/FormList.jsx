import React from 'react';
import {Button, Container, Icon, Input, Message, Pagination, Segment, Statistic, Table} from 'semantic-ui-react'
import _ from 'lodash'
import DeleteFormButton from "../../common/components/DeleteFormButton";
import useGetForms from "../useGetForms";
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import "../../common/components/FormBuilderComponent.scss"
import {useTranslation} from "react-i18next";
import useEnvContext from "../../../../core/context/useEnvContext";

const FormList = () => {
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
        handleEditForm
    } = useGetForms();

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
    return <Container>
        <Segment raised>
            <Statistic.Group widths='three'>
                <Statistic horizontal>
                    <Statistic.Value>
                        {total}
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
        <Segment.Group>
            <Segment basic>
                <Input data-cy="search-title" icon='search' placeholder={t('form.list.search-label')} size='large'
                       onChange={handleTitleSearch}
                       fluid focus/>
            </Segment>
            <Segment basic loading={!status || status === EXECUTING}>
                <Table columns={6} sortable celled stackable data-cy="forms-table">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{t('form.list.table.formIdentifierCellLabel')}</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'title' ? direction : null}
                                              onClick={
                                                  handleSort('title')}
                                              width={10}>{t('form.list.table.formTitleCellLabel')}</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'name' ? direction : null}
                                              onClick={handleSort('name')}>{t('form.list.table.formNameCellLabel')}</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'path' ? direction : null}
                                              onClick={handleSort('path')}>{t('form.list.table.formPathCellLabel')}</Table.HeaderCell>
                            <Table.HeaderCell sorted={column === 'display' ? direction : null}
                                              onClick={handleSort('display')}>{t('form.list.table.formTypeCellLabel')}</Table.HeaderCell>
                            <Table.HeaderCell>{t('form.list.table.formActionsCellLabel')}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body data-cy="form-table-data">
                        {_.map(data, (form) => (
                            <Table.Row key={form._id}>
                                <Table.Cell>{form._id}</Table.Cell>
                                <Table.Cell>{form.title}</Table.Cell>
                                <Table.Cell>{form.name}</Table.Cell>
                                <Table.Cell>{form.path}</Table.Cell>
                                <Table.Cell>{form.display ? form.display : 'form'}</Table.Cell>
                                <Table.Cell>
                                    <Button.Group>
                                        <DeleteFormButton form={form}
                                                          onSuccessfulDeletion={handleOnSuccessfulDeletion}/>
                                        <Button.Or/>
                                        <Button positive
                                                onClick={() => handleEditForm(form)}>{t('form.edit.label')}</Button>
                                        <Button.Or/>
                                        <Button primary
                                                onClick={() => handlePreview(form)}>{t('form.preview.label')}</Button>
                                    </Button.Group>
                                </Table.Cell>

                            </Table.Row>
                        ))}
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='1'>{total} forms</Table.HeaderCell>
                            {total > limit ? <Table.HeaderCell colSpan='3'>
                                <Pagination totalPages={Math.ceil(parseInt(total) / limit)}
                                            activePage={activePage}
                                            ellipsisItem={{content: <Icon name='ellipsis horizontal'/>, icon: true}}
                                            firstItem={{content: <Icon name='angle double left'/>, icon: true}}
                                            lastItem={{content: <Icon name='angle double right'/>, icon: true}}
                                            prevItem={{content: <Icon name='angle left'/>, icon: true}}
                                            nextItem={{content: <Icon name='angle right'/>, icon: true}}
                                            onPageChange={handlePaginationChange}/>
                            </Table.HeaderCell> : <Table.HeaderCell colSpan='3'/>}
                            <Table.HeaderCell colSpan={6}>
                                <Button floated='right' icon labelPosition='left' primary size='small'
                                        onClick={() => navigation.navigate(`/forms/${envContext.id}/create`)}>
                                    <Icon name='wpforms'/>{t('form.create.label')}
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </Segment>
        </Segment.Group></Container>
};


export default FormList;
