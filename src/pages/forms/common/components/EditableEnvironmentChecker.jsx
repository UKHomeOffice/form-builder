import useEnvContext from "../../../../core/context/useEnvContext";
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

const EditableEnvironmentChecker = ({children}) => {
    const {envContext} = useEnvContext();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);

    if (!envContext) {
        return <Container>
            <div style={{'paddingTop': '20px'}}>
                <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>{t('error.no-context')}</Alert.Heading>
                    <p>
                        {t('error.no-context-message')}
                    </p>
                </Alert>
            </div>
        </Container>
    }
    if (envContext.editable) {
        return <div>{children}</div>;
    } else {
        return <Container>
            <div style={{'paddingTop': '20px'}}>
                <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>{t('form.create.not-allowed.title')}</Alert.Heading>
                    <p>
                        {t('form.create.not-allowed.message')}
                    </p>
                </Alert>
            </div>
        </Container>

    }

};

export default EditableEnvironmentChecker;
