import React from 'react';
import _ from 'lodash';
import uuid4 from "uuid4";
import {useTranslation} from "react-i18next";

const ValidationError = ({validationErrors, translateKey}) => {
    const {t} = useTranslation();
    return <div>
        <h6>{t(translateKey)}</h6>
        <h6>Validation errors:</h6>
        <ul>
            {
                _.map(validationErrors, (error) => {
                    return <li key={uuid4()}>
                        {error.type} - {error.message}
                    </li>
                })
            }
        </ul>
    </div>
};

export default ValidationError;
