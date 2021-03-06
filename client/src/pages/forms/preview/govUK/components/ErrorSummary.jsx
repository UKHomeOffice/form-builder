import React from 'react';
import eventEmitter from "../../../../../core/eventEmitter";
import Container from "react-bootstrap/Container";
import uuid from 'uuid4';
import _ from 'lodash';
import parse from 'html-react-parser';

class ErrorSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: []
        }
    }

    componentDidMount() {
        eventEmitter.subscribe('formSubmissionError', ({errors, form}) => {
              const updated = errors.map(error => {
                  return {message: error.message, instance: form.formio.getComponent(error.component.key)};
              });
            this.setState({
                errors: updated
            })
        });
        eventEmitter.subscribe('formSubmissionSuccessful', () => {
            this.setState({
                errors: []
            })
        });
        eventEmitter.subscribe('formChange', ({value, form}) => {

            if (this.state.errors.length !== 0) {
                let instance;
                if (form.instance._form.display === 'wizard') {
                    instance = form.formio.currentPage;
                } else {
                    instance = form.formio;
                }
                if (instance.isValid(value.data, true)) {
                    this.setState({
                        errors: []
                    });
                } else {
                    this.setState({
                        errors: _.filter(this.state.errors, ({message, instance}) => {
                            return instance.component.key !== value.changed.component.key;
                        })
                    })
                }
            }
        });
    }

    render() {
        return this.state.errors && this.state.errors.length !== 0 ? <Container>
                <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabIndex="-1"
                     data-module="govuk-error-summary">
                    <h2 className="govuk-error-summary__title" id="error-summary-title">
                        There is a problem with your form
                    </h2>
                    <div className="govuk-error-summary__body">
                        <ul className="govuk-list govuk-error-summary__list">
                            {this.state.errors.map(({message,instance}) => {
                                return <li key={uuid()}>
                                    <a href="#" onClick={() => {
                                        instance.focus();
                                    }}><div>{parse(message)}</div></a>
                                </li>
                            })}

                        </ul>
                    </div>
                </div>
            </Container>
            : null;
    }
}

export default ErrorSummary;
