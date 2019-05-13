import React from 'react';
import AppMenu from "../common/AppMenu";
import Footer from "../common/Footer";
import {NavNotFoundBoundary} from "react-navi";
import PageNotFound from "../common/PageNotFound";
import Notification from "../common/Notification";
import AppHeader from "../common/AppHeader";
import {Container} from "semantic-ui-react";


export const Main = ({children}) => {
    return <React.Fragment>
        <AppMenu/>
        <Container>
            <AppHeader/>
            <Notification/>
        </Container>
        <NavNotFoundBoundary render={PageNotFound}>
            {children || null}
        </NavNotFoundBoundary>
        <Footer/>
    </React.Fragment>
};
