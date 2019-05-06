import React, {useState} from 'react';
import AppMenu from "../common/AppMenu";
import Footer from "../common/Footer";
import {NavNotFoundBoundary} from "react-navi";
import PageNotFound from "../common/PageNotFound";
import {Container} from 'semantic-ui-react';
import Notification from "../common/Notification";
import AppHeader from "../common/AppHeader";

export const ApplicationContext = React.createContext([{}, () => {}]);

export const Main = ({children}) => {
    const [state, setState] = useState({});
    return <div>
        <AppMenu/>
        <Container>
            <ApplicationContext.Provider value={{state, setState}}>
                <AppHeader/>
                <Notification/>
                <NavNotFoundBoundary render={PageNotFound}>
                    {children || null}
                </NavNotFoundBoundary>
            </ApplicationContext.Provider>
        </Container>
        <Footer/>
    </div>
};
