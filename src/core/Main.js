import React from 'react';
import Header from "../common/Header";
import Footer from "../common/Footer";
import {NavNotFoundBoundary, useLoadingRoute} from "react-navi";
import PageNotFound from "../common/PageNotFound";
import {Container} from 'semantic-ui-react'

export const Main = ({children}) => {
    const loadingRoute = useLoadingRoute();
    console.log(loadingRoute);
    return <div>
        <Header/>
        <Container>
            <NavNotFoundBoundary render={PageNotFound}>
                <div style={{paddingTop: '10px'}}>{children || null}</div>
            </NavNotFoundBoundary>
        </Container>
        <Footer/>
    </div>
};
