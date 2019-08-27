import React from "react";
import "bootstrap-switch-button-react/src/style.css";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

export default class ExtendedBootstrapSwitchButton extends BootstrapSwitchButton {

    componentDidUpdate(_, prevState) {
        const {checked} = this.props;
        if (typeof checked === "boolean" && checked !== prevState.checked) {
            this.setState({checked})
        }
    }

}
