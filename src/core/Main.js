import React from 'react';
import AppMenu from "../common/AppMenu";
import Footer from "../common/Footer";
import {NavNotFoundBoundary} from "react-navi";
import PageNotFound from "../common/PageNotFound";
import {Container} from 'semantic-ui-react';
import Notification from "../common/Notification";
import AppHeader from "../common/AppHeader";

export const ApplicationContext = React.createContext([{}, () => {
}]);

export const Main = ({children}) => {
    return <React.Fragment>
        <AppMenu/>
        <Container>
            <AppHeader/>
            <Notification/>
            <NavNotFoundBoundary render={PageNotFound}>
                {children || null}
            </NavNotFoundBoundary>
        </Container>
        <Footer/>
    </React.Fragment>
};
