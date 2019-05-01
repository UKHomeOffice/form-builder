import React from 'react';
import Header from "../common/Header";
import Footer from "../common/Footer";
import {NavNotFoundBoundary, useLoadingRoute} from "react-navi";
import PageNotFound from "../common/PageNotFound";

export const Main = ({children}) => {
    const loadingRoute = useLoadingRoute();
    console.log(loadingRoute);
    return <div>
        <Header/>
        <main className="container">
            <NavNotFoundBoundary render={PageNotFound}>
                {children || null}
            </NavNotFoundBoundary>
        </main>
        <Footer/>
    </div>
};
