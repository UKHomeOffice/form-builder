import React, {Component} from 'react';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import './FormJsonSchemaEditor.scss';
import {withTranslation} from "react-i18next";
import _ from 'lodash';
import Form from "react-bootstrap/Form";


class FormJsonSchemaEditor extends Component {
    componentDidMount() {
        const optionsFromPops = Object.assign({}, this.props);

        const nonEditableFields = ['id', 'access', 'links', 'versionId', 'createdOn', 'updatedOn', 'latest'];

        const options = _.omit(optionsFromPops, ['json', 'text', 't', 'readonly', 'i18n', 'tReady']);

        if (!this.props.readonly) {
            options['onEditable'] = (node) => {
                return {field: false, value: !_.includes(nonEditableFields, node.field)}
            };
        } else {
            options['onEditable'] = (node) => {
                return false;
            };
        }


        this.jsoneditor = new JSONEditor(this.container, options);

        if ('json' in this.props) {
            this.jsoneditor.set(this.props.json);
        }
        if ('text' in this.props) {
            this.jsoneditor.setText(this.props.text);
        }

        this.schema = cloneDeep(this.props.schema);
        this.schemaRefs = cloneDeep(this.props.schemaRefs);
    }

    componentDidUpdate() {
        if ('json' in this.props) {
            this.jsoneditor.update(this.props.json);
        }

        if ('text' in this.props) {
            this.jsoneditor.updateText(this.props.text);
        }

        if ('mode' in this.props) {
            this.jsoneditor.setMode(this.props.mode);
        }

        // store a clone of the schema to keep track on when it actually changes.
        // (When using a PureComponent all of this would be redundant)
        const schemaChanged = !isEqual(this.props.schema, this.schema);
        const schemaRefsChanged = !isEqual(this.props.schemaRefs, this.schemaRefs);
        if (schemaChanged || schemaRefsChanged) {
            this.schema = cloneDeep(this.props.schema);
            this.schemaRefs = cloneDeep(this.props.schemaRefs);
            this.jsoneditor.setSchema(this.props.schema, this.props.schemaRefs);
        }
    }

    componentWillUnmount() {
        if (this.jsoneditor) {
            this.jsoneditor.destroy();
        }
    }

    render() {
        return <React.Fragment>
            <div className="mb-2"><Form.Label
                className="font-weight-bold">Select editor mode</Form.Label>
            <Form.Control as="select"
                          data-cy="jsonEditorType"
                          onChange={this.props.handleEditModeView}>
                <option value="tree">Tree</option>
                <option value="code">Code</option>
                <option value="text">Text</option>

            </Form.Control>
            </div>
            <div className="jsoneditor-react-container" id="jsoneditor" ref={elem => this.container = elem}/>
        </React.Fragment>;
    }
}

export default withTranslation()(FormJsonSchemaEditor);
