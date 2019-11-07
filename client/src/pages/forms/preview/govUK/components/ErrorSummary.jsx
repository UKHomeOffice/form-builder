import React from 'react';
import eventEmitter from "../../../../../core/eventEmitter";
import Container from "react-bootstrap/Container";
import uuid from 'uuid4';
import _ from 'lodash';

class ErrorSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: []
        }
    }

    componentDidMount() {
        eventEmitter.subscribe('formSubmissionError', (errors) => {
            this.setState({
                errors: errors
            })
        });
        eventEmitter.subscribe('formSubmissionSuccessful', () => {
            this.setState({
                errors: []
            })
        });
        eventEmitter.subscribe('formChange', (value) => {
            this.setState({
                errors: _.filter(this.state.errors, error => {
                    return error.component.key !== value.changed.component.key;
                })
            })
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
                            {this.state.errors.map(e => {
                                return <li key={uuid()}>
                                    <a href="#">{e.message}</a>
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