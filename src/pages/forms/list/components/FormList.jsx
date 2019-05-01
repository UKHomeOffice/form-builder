import React, {useState} from 'react';
import {Table, Button, Icon, Pagination} from 'semantic-ui-react'
import _ from 'lodash'

const FormList = ({forms}) => {

    const [sort, setSort] = useState({
        column: null,
        direction: null
    });

    const handleSort = clickedColumn => () => {
        if (sort.column !== clickedColumn) {
            _.sortBy(forms, [clickedColumn]);
            setSort({
                column: clickedColumn,
                direction: 'ascending'
            });
        } else {
            setSort({
                direction: sort.direction === 'ascending' ? 'descending' : 'ascending'
            });
            forms.reverse();
        }
    };

    return <Table columns={5} sortable celled>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Form Identifier</Table.HeaderCell>
                <Table.HeaderCell sorted={sort.column === 'title' ? sort.direction : null}
                                  onClick={
                                      handleSort('title')}>Title</Table.HeaderCell>
                <Table.HeaderCell sorted={sort.column === 'name' ? sort.direction : null}
                                  onClick={handleSort('name')}>Name</Table.HeaderCell>
                <Table.HeaderCell sorted={sort.column === 'path' ? sort.direction : null}
                                  onClick={handleSort('path')}>Path</Table.HeaderCell>
                <Table.HeaderCell sorted={sort.column === 'display' ? sort.direction : null}
                                  onClick={handleSort('display')}>Type</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>

            </Table.Row>
        </Table.Header>

        <Table.Body>
            {_.map(forms, (form) => (
                <Table.Row key={form._id}>
                    <Table.Cell>{form._id}</Table.Cell>
                    <Table.Cell>{form.title}</Table.Cell>
                    <Table.Cell>{form.name}</Table.Cell>
                    <Table.Cell>{form.path}</Table.Cell>
                    <Table.Cell>{form.display ? form.display : 'form'}</Table.Cell>
                    <Table.Cell>
                        <Button.Group>
                            <Button negative>Delete</Button>
                            <Button.Or />
                            <Button positive>Edit</Button>
                            <Button.Or />
                            <Button primary>Preview</Button>
                        </Button.Group>
                    </Table.Cell>

                </Table.Row>
            ))}
        </Table.Body>

        <Table.Footer fullWidth>
            <Table.Row>
                <Table.HeaderCell colSpan='1'>{forms.length} forms</Table.HeaderCell>
                {forms.length !== 0 ? <Table.HeaderCell colSpan='3'>
                    <Pagination totalPages="10" activePage="2" />
                </Table.HeaderCell> : null}
                <Table.HeaderCell colSpan={forms.length === 0 ? '6' : '2'}>
                    <Button floated='right' icon labelPosition='left' primary size='small' onClick={() => alert("hello")}>
                        <Icon name='wpforms' />Create form
                    </Button>
                </Table.HeaderCell>
            </Table.Row>
        </Table.Footer>
    </Table>
};

export default FormList;
