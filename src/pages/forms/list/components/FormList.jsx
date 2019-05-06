import React from 'react';
import {Button, Icon, Input, Message, Pagination, Segment, Table} from 'semantic-ui-react'
import _ from 'lodash'
import DeleteFormButton from "../../common/components/DeleteFormButton";
import useGetForms from "../useGetForms";
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import "../../create/components/CreateFormBuilder.scss"

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
        handlePreview
    } = useGetForms();

    const {direction, column, data, total, activePage, limit} = forms;

    if (status === ERROR) {
        return <Message icon negative>
            <Icon name='warning circle'/>
            <Message.Content>
                <Message.Header>Error</Message.Header>
                {`Failed to load forms due to ${JSON.stringify(response.data)}`}
            </Message.Content>
        </Message>
    }
    return <Segment.Group>
        <Segment basic>
            <Input icon='search' placeholder='Search by title...' size='large' onChange={handleTitleSearch} fluid focus/>
        </Segment>
        <Segment basic loading={!status || status === EXECUTING}>
            <Table columns={6} sortable celled stackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Form Identifier</Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'title' ? direction : null}
                                          onClick={
                                              handleSort('title')} width={10}>Title</Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'name' ? direction : null}
                                          onClick={handleSort('name')}>Name</Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'path' ? direction : null}
                                          onClick={handleSort('path')}>Path</Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'display' ? direction : null}
                                          onClick={handleSort('display')}>Type</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>

                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {_.map(data, (form) => (
                        <Table.Row key={form._id}>
                            <Table.Cell>{form._id}</Table.Cell>
                            <Table.Cell>{form.title}</Table.Cell>
                            <Table.Cell>{form.name}</Table.Cell>
                            <Table.Cell>{form.path}</Table.Cell>
                            <Table.Cell>{form.display ? form.display : 'form'}</Table.Cell>
                            <Table.Cell>
                                <Button.Group>
                                    <DeleteFormButton form={form} onSuccessfulDeletion={handleOnSuccessfulDeletion}/>
                                    <Button.Or/>
                                    <Button positive>Edit</Button>
                                    <Button.Or/>
                                    <Button primary onClick={() => handlePreview(form)}>Preview</Button>
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
                                        ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                        prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                        nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                        onPageChange={handlePaginationChange}/>
                        </Table.HeaderCell> : <Table.HeaderCell colSpan='3' />}
                        <Table.HeaderCell colSpan={6}>
                            <Button floated='right' icon labelPosition='left' primary size='small'
                                    onClick={() => navigation.navigate('/forms/create')}>
                                <Icon name='wpforms'/>Create form
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </Segment>
    </Segment.Group>
};


export default FormList;
