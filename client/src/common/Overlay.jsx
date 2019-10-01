import React from "react";
import {useTranslation} from "react-i18next";

const Overlay = ({active, children, styleName, loadingText}) => {
     if (active) {
        return <TextSpinner styleName={styleName} loadingText={loadingText}/>;
    } else {
        return children;
    }
};

export const TextSpinner = ({loadingText, styleName}) => {
    const {t} = useTranslation();
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
    </div>
}
export default Overlay;
