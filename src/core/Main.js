import React, {useState} from 'react';
import Header from "../common/Header";
import Footer from "../common/Footer";
import {NavNotFoundBoundary} from "react-navi";
import PageNotFound from "../common/PageNotFound";
import {Container} from 'semantic-ui-react';
import Notification from "../common/Notification";

export const ApplicationContext = React.createContext([{}, () => {}]);

export const Main = ({children}) => {
    const [state, setState] = useState({});
    return <div>
        <Header/>
        <Container>
            <ApplicationContext.Provider value={[state, setState]}>
                <Notification/>
                <NavNotFoundBoundary render={PageNotFound}>
                    {children || null}
                </NavNotFoundBoundary>
            </ApplicationContext.Provider>
        </Container>
        <Footer/>
    </div>
};
