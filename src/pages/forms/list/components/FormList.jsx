import React, {useState} from 'react';
import {Button, Icon, Pagination, Table} from 'semantic-ui-react'
import _ from 'lodash'

const FormList = ({forms}) => {

    const [sort, setSort] = useState({
        column: null,
        direction: null,
        data: forms
    });

    const handleSort = clickedColumn => () => {
        const {column, direction, data} = sort;
        if (column !== clickedColumn) {
            setSort({
                column: clickedColumn,
                data: _.sortBy(data, (form) => {
                    return form[clickedColumn] ? form[clickedColumn].toLowerCase() : true;
                }),
                direction: 'ascending'
            });
            return;
        }
        setSort({
            data: data.reverse(),
            column: clickedColumn,
            direction: direction === 'ascending' ? 'descending' : 'ascending'
        });

    };

    const {direction, column, data} = sort;

    return <Table columns={6} sortable celled stackable>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Form Identifier</Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'title' ? direction : null}
                                  onClick={
                                      handleSort('title')}>Title</Table.HeaderCell>
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
                            <Button negative>Delete</Button>
                            <Button.Or/>
                            <Button positive>Edit</Button>
                            <Button.Or/>
                            <Button primary>Preview</Button>
                        </Button.Group>
                    </Table.Cell>

                </Table.Row>
            ))}
        </Table.Body>

        <Table.Footer fullWidth>
            <Table.Row>
                <Table.HeaderCell colSpan='1'>{data.length} forms</Table.HeaderCell>
                {data.length !== 0 ? <Table.HeaderCell colSpan='3'>
                    <Pagination totalPages="10" activePage="2"/>
                </Table.HeaderCell> : null}
                <Table.HeaderCell colSpan={forms.length === 0 ? '6' : '2'}>
                    <Button floated='right' icon labelPosition='left' primary size='small'
                            onClick={() => alert("hello")}>
                        <Icon name='wpforms'/>Create form
                    </Button>
                </Table.HeaderCell>
            </Table.Row>
        </Table.Footer>
    </Table>
};

export default FormList;
