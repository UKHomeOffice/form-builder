import React from 'react';
import Header from "../common/Header";
import Footer from "../common/Footer";
import {NavNotFoundBoundary} from "react-navi";
import PageNotFound from "../common/PageNotFound";
import {Container} from 'semantic-ui-react';

export const Main = ({children}) => {
    return <div>
        <Header/>
        <Container>
            <NavNotFoundBoundary render={PageNotFound}>
                {children || null}
            </NavNotFoundBoundary>
        </Container>
        <Footer/>
    </div>
};
