import React from "react";
import Spinner from "react-bootstrap/Spinner";
import {useTranslation} from "react-i18next";

const Overlay = ({active, children, styleName, loadingText}) => {
    const {t} = useTranslation();
    if (active) {
        const loadingContent = loadingText ? loadingText : t('loading');
        return <div className={`d-flex flex-column align-items-center justify-content-center ${styleName}`}>
            <div className="row">
                <div className="spinner-border" role="status">
                    <span className="sr-only">{loadingContent}</span>
                </div>
            </div>
            <div className="row">
                <strong>
                    {loadingContent}
                </strong>
            </div>
        </div>;
    } else {
        return children;
    }
};

export default Overlay;
