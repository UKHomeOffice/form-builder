import React from "react";
import Spinner from "react-bootstrap/Spinner";
import {useTranslation} from "react-i18next";

const Overlay = ({active, children}) => {
    const {t} = useTranslation();
    if (active) {
        return <div className="center-context"><Spinner animation="border" role="status">
            <span className="sr-only">{t('loading')}</span>
        </Spinner></div>
    } else {
        return children;
    }
};

export default Overlay;
