import React from 'react';
import {
    Accordion,
    Button,
    Card,
    Container,
    Dimmer,
    Form,
    Grid,
    Icon,
    Input,
    Label,
    List,
    Loader,
    Menu,
    Message,
    Pagination,
    Segment,
    Statistic,
    Table
} from 'semantic-ui-react'
import {isMobile} from 'react-device-detect';
import useGetForms from "../useGetForms";
import {ERROR, EXECUTING} from "../../../../core/api/actionTypes";
import "../../common/components/FormBuilderComponent.scss"
import {useTranslation} from "react-i18next";
import useEnvContext from "../../../../core/context/useEnvContext";
import _ from 'lodash';
import moment from "moment";
import useRoles from "../../common/useRoles";
import ButtonGroup from "./ButtonGroup";
import './FormList.scss';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
        handleEditForm,
        handleAccordionClick,
        download,
        downloadFormState,
        handlePromotion,
        filter,
        handleFilterAccordion,
    } = useGetForms();

    const {canEdit} = useRoles();
    const {t} = useTranslation();
    const {envContext} = useEnvContext();

    const FormType = (
        <Form>
            <Form.Group grouped>
                <Form.Radio label='All' name='all' type='radio' value='all' onChange={filter}
                            checked={forms.filterValue === 'all'}/>
                <Form.Radio label='Forms' name='form' type='radio' value='form' onChange={filter}
                            checked={forms.filterValue === 'form'}/>
                <Form.Radio label='Wizards' name='wizard' type='radio' value='wizard' onChange={filter}
                            checked={forms.filterValue === 'wizard'}/>
            </Form.Group>
        </Form>
    );

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
    const isEditable = (canEdit() && envContext.editable);
    return <React.Fragment>
        <Container>
            <Row>
                <Col>1 of 2</Col>
                <Col>2 of 2</Col>
                <Col>2 of 3</Col>

            </Row>
            <Row>
                <Col>Search</Col>

            </Row>
            <Row>
                <Col>Filter</Col>

            </Row>
            <Row>
                <Col>Data</Col>

            </Row>
        </Container>
    </React.Fragment>


    {/*<Container>*/}
        {/*<Grid>*/}
            {/*<Grid.Row>*/}
                {/*<Grid.Column>*/}
                    {/*<Segment raised>*/}
                        {/*<Statistic.Group widths={isMobile ? 'one' : 'three'}>*/}
                            {/*<Statistic>*/}
                                {/*<Statistic.Value>*/}
                                    {/*{forms.numberOfForms + forms.numberOfWizards}*/}
                                {/*</Statistic.Value>*/}
                                {/*<Statistic.Label>{t('form.list.total-forms', {env: envContext.label})}</Statistic.Label>*/}
                            {/*</Statistic>*/}
                            {/*<Statistic>*/}
                                {/*<Statistic.Value>{forms.numberOfForms}</Statistic.Value>*/}
                                {/*<Statistic.Label>{t('form.list.total-form-type')}</Statistic.Label>*/}
                            {/*</Statistic>*/}
                            {/*<Statistic>*/}
                                {/*<Statistic.Value>{forms.numberOfWizards}</Statistic.Value>*/}
                                {/*<Statistic.Label>{t('form.list.total-wizard-type')}</Statistic.Label>*/}
                            {/*</Statistic>*/}
                        {/*</Statistic.Group>*/}
                    {/*</Segment>*/}
                {/*</Grid.Column>*/}
            {/*</Grid.Row>*/}
            {/*<Grid.Row>*/}
                {/*<Grid.Column>*/}
                    {/*<Input data-cy="search-title" icon='search'*/}
                           {/*name="search-title"*/}
                           {/*placeholder={t('form.list.search-label')}*/}
                           {/*size='large'*/}
                           {/*onChange={handleTitleSearch}*/}
                           {/*fluid focus/>*/}
                {/*</Grid.Column>*/}
            {/*</Grid.Row>*/}
            {/*<Grid.Row>*/}
                {/*<Grid.Column>*/}
                    {/*<Accordion as={Menu} vertical>*/}
                        {/*<Menu.Item>*/}
                            {/*<Accordion.Title*/}
                                {/*active={forms.filterIndex === 0}*/}
                                {/*content='Types'*/}
                                {/*index={0}*/}
                                {/*onClick={handleFilterAccordion}*/}
                            {/*/>*/}
                            {/*<Accordion.Content active={forms.filterIndex === 0} content={FormType}/>*/}
                        {/*</Menu.Item>*/}
                    {/*</Accordion>*/}
                {/*</Grid.Column>*/}
            {/*</Grid.Row>*/}
            {/*<Grid.Row>*/}
                {/*<Grid.Column>*/}
                    {/*<Dimmer.Dimmable dimmed={isLoading}>*/}
                        {/*<Dimmer active={isLoading} inverted>*/}
                            {/*<Loader active inline='centered' size='large'>{t('form.list.loading')}</Loader>*/}
                        {/*</Dimmer>*/}
                        {/*<Table columns={4} sortable stackable data-cy="forms-table" striped>*/}
                            {/*<Table.Header>*/}
                                {/*<Table.Row>*/}
                                    {/*<Table.HeaderCell sorted={column === 'title' ? direction : null}*/}
                                                      {/*onClick={*/}
                                                          {/*handleSort('title')}*/}
                                                      {/*width={10}>{t('form.list.table.formTitleCellLabel')}</Table.HeaderCell>*/}
                                    {/*<Table.HeaderCell sorted={column === 'name' ? direction : null}*/}
                                                      {/*onClick={handleSort('name')}>{t('form.list.table.formNameCellLabel')}</Table.HeaderCell>*/}
                                    {/*<Table.HeaderCell sorted={column === 'display' ? direction : null}*/}
                                                      {/*onClick={handleSort('display')}>{t('form.list.table.formTypeCellLabel')}</Table.HeaderCell>*/}
                                    {/*<Table.HeaderCell>{t('form.list.table.formActionsCellLabel')}</Table.HeaderCell>*/}

                                {/*</Table.Row>*/}
                            {/*</Table.Header>*/}
                            {/*<Table.Body data-cy="form-table-data">*/}
                                {/*{_.map(data, (form, index) => (*/}
                                    {/*<Table.Row key={form.id}>*/}
                                        {/*<Table.Cell>*/}
                                            {/*<Accordion>*/}
                                                {/*<Accordion.Title active={forms.activeIndex === index} index={index}*/}
                                                                 {/*onClick={handleAccordionClick}>*/}
                                                    {/*<Icon name='dropdown'/>*/}
                                                    {/*{form.title}*/}
                                                {/*</Accordion.Title>*/}
                                                {/*<Accordion.Content active={forms.activeIndex === index}>*/}
                                                    {/*<div id="formDetails">*/}
                                                        {/*<Card>*/}
                                                            {/*<Card.Content header={form.title}/>*/}
                                                            {/*<Card.Content description={*/}
                                                                {/*<List>*/}
                                                                    {/*<List.Item>*/}
                                                                        {/*<List.Header>Identifier:</List.Header>*/}
                                                                        {/*<List.Content>{form.id}</List.Content>*/}
                                                                    {/*</List.Item>*/}
                                                                    {/*<List.Item>*/}
                                                                        {/*<List.Header>Name:</List.Header>*/}
                                                                        {/*<List.Content>{form.name}</List.Content>*/}
                                                                    {/*</List.Item>*/}
                                                                    {/*<List.Item>*/}
                                                                        {/*<List.Header>Path:</List.Header>*/}
                                                                        {/*<List.Content>{form.path}</List.Content>*/}
                                                                    {/*</List.Item>*/}
                                                                    {/*<List.Item>*/}
                                                                        {/*<List.Header>Created:</List.Header>*/}
                                                                        {/*<List.Content>{moment(form.createdOn).fromNow()}</List.Content>*/}
                                                                    {/*</List.Item>*/}
                                                                    {/*<List.Item>*/}
                                                                        {/*<List.Header>Updated:</List.Header>*/}
                                                                        {/*<List.Content>{moment(form.updatedOn).fromNow()}</List.Content>*/}
                                                                    {/*</List.Item>*/}
                                                                {/*</List>*/}
                                                            {/*}/>*/}
                                                            {/*{isEditable ? <Card.Content extra>*/}
                                                                {/*<Button size='tiny' color='blue'*/}
                                                                        {/*onClick={() => download(form.id, form.name)}>*/}
                                                                    {/*Download*/}
                                                                {/*</Button>*/}
                                                            {/*</Card.Content> : null}*/}
                                                        {/*</Card>*/}
                                                    {/*</div>*/}
                                                {/*</Accordion.Content>*/}
                                            {/*</Accordion>*/}
                                        {/*</Table.Cell>*/}
                                        {/*<Table.Cell>{form.name}</Table.Cell>*/}
                                        {/*<Table.Cell>*/}
                                            {/*<div style={{*/}
                                                {/*alignItems: 'center',*/}
                                                {/*justifyContent: 'center',*/}
                                                {/*display: 'flex'*/}
                                            {/*}}><Label size='large'*/}
                                                      {/*basic*/}
                                                      {/*icon={!form.display || form.display === 'form' ? 'wpforms' : form.display}*/}
                                                      {/*content={form.display ? form.display : 'form'}/></div>*/}
                                        {/*</Table.Cell>*/}
                                        {/*<Table.Cell>*/}
                                            {/*<ButtonGroup form={form}*/}
                                                         {/*handlePreview={handlePreview}*/}
                                                         {/*handleEditForm={handleEditForm}*/}
                                                         {/*handlePromotion={handlePromotion}*/}
                                                         {/*handleOnSuccessfulDeletion={handleOnSuccessfulDeletion}/>*/}
                                        {/*</Table.Cell>*/}
                                    {/*</Table.Row>*/}
                                {/*))}*/}
                            {/*</Table.Body>*/}
                            {/*<Table.Footer>*/}
                                {/*<Table.Row>*/}
                                    {/*<Table.HeaderCell colSpan={1}>{total} forms</Table.HeaderCell>*/}
                                    {/*<Table.HeaderCell colSpan={isEditable ? 2 : 3}>*/}
                                        {/*<Pagination totalPages={Math.ceil(parseInt(total) / limit)}*/}
                                                    {/*activePage={activePage}*/}
                                                    {/*disabled={total <= limit}*/}
                                                    {/*ellipsisItem={isMobile ? null : {*/}
                                                        {/*content: <Icon name='ellipsis horizontal'/>,*/}
                                                        {/*icon: true*/}
                                                    {/*}}*/}
                                                    {/*firstItem={isMobile ? null : {*/}
                                                        {/*content: <Icon name='angle double left'/>,*/}
                                                        {/*icon: true*/}
                                                    {/*}}*/}
                                                    {/*lastItem={isMobile ? null : {*/}
                                                        {/*content: <Icon name='angle double right'/>,*/}
                                                        {/*icon: true*/}
                                                    {/*}}*/}
                                                    {/*prevItem={{content: <Icon name='angle left'/>, icon: true}}*/}
                                                    {/*nextItem={{content: <Icon name='angle right'/>, icon: true}}*/}
                                                    {/*onPageChange={handlePaginationChange}/>*/}
                                    {/*</Table.HeaderCell>*/}
                                    {/*{isEditable ? <Table.HeaderCell colSpan={2}>*/}
                                            {/*<Button floated={isMobile ? null : 'right'} icon labelPosition='left' primary*/}
                                                    {/*size='small'*/}
                                                    {/*onClick={() => navigation.navigate(`/forms/${envContext.id}/create`)}*/}
                                                    {/*data-cy="create-form">*/}
                                                {/*<Icon name='wpforms'/>{t('form.create.label')}*/}
                                            {/*</Button>*/}
                                        {/*</Table.HeaderCell> :*/}
                                        {/*<React.Fragment><Table.HeaderCell/><Table.HeaderCell/></React.Fragment>}*/}
                                {/*</Table.Row>*/}
                            {/*</Table.Footer>*/}
                        {/*</Table>*/}
                    {/*</Dimmer.Dimmable>*/}
                {/*</Grid.Column>*/}
            {/*</Grid.Row>*/}
        {/*</Grid>*/}

    {/*</Container>*/}
};


export default FormList;
