import React, {Component} from 'react';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import './FormJsonSchemaEditor.scss';
import {withTranslation} from "react-i18next";
import _ from 'lodash';
import Form from "react-bootstrap/Form";
import PropTypes from 'prop-types';

class FormJsonSchemaEditor extends Component {
    constructor(props) {
        super(props);
        this.handleViewOnModeChange = this.handleViewOnModeChange.bind(this);
    }

    componentDidMount() {
        const optionsFromPops = Object.assign({}, this.props);

        const nonEditableFields = ['id', 'access', 'links', 'versionId', 'createdOn', 'updatedOn', 'latest'];

        const options = _.omit(optionsFromPops,
            ['json', 'text', 't', 'readonly', 'i18n', 'tReady', 'handleEditModeView',
                'refreshOnContentChange',
                'editor',
                'disableModeSelection']);


        if (this.props.onChange) {
            options['onChangeText'] = this.props.onChange;
        }

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
            this.jsoneditor.setText(JSON.stringify(this.props.json));
        }

        this.schema = cloneDeep(this.props.schema);
        this.schemaRefs = cloneDeep(this.props.schemaRefs);

        if (this.props.editor) {
            this.props.editor(this.jsoneditor);
        }

        this.handleViewOnModeChange();
    }

    componentDidUpdate() {
        if ('json' in this.props) {
            this.jsoneditor.set(this.props.json);
        }

        if ('text' in this.props) {
            this.jsoneditor.setText(JSON.stringify(this.props.json));
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

        this.handleViewOnModeChange();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.mode !== nextProps.mode
            || (this.props.refreshOnContentChange ? this.props.json !== nextProps.json : false);
    }

    handleViewOnModeChange() {
        if (this.props.mode === 'text' || this.props.mode === 'code') {
            this.container.style.height = '700px';
        } else {
            this.container.style.height = '700px';
        }
    }

    componentWillUnmount() {
        if (this.jsoneditor) {
            this.jsoneditor.destroy();
        }
    }

    render() {
        return <React.Fragment>
            {!this.props.disableModeSelection ?
            <div className="mb-2"><Form.Label
                className="font-weight-bold">Select editor mode</Form.Label>
                <Form.Control as="select"
                              data-cy="jsonEditorType"
                              defaultValue={this.props.mode}
                              onChange={this.props.handleEditModeView}>
                    <option value="code">Code</option>
                    <option value="tree">Tree</option>
                    <option value="text">Text</option>

                </Form.Control>
            </div> : null}
            <div className="jsoneditor-react-container" id="jsoneditor" ref={elem => this.container = elem}/>
        </React.Fragment>;
    }
}

FormJsonSchemaEditor.propTypes = {
    refreshOnContentChange: PropTypes.bool,
    handleEditModeView: PropTypes.func,
};
export default withTranslation()(FormJsonSchemaEditor);
