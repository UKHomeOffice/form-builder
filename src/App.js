import React from 'react';
import './App.scss';
import Header from "./common/Header";
import Footer from "./common/Footer";
import {NavNotFoundBoundary, useLoadingRoute} from "react-navi";
import PageNotFound from "./pages/PageNotFound";

export const App = ({children}) => {
    const loadingRoute = useLoadingRoute();
    return <div>
        <Header/>
        <main>
            <NavNotFoundBoundary render={PageNotFound}>
                {children || null}
            </NavNotFoundBoundary>
        </main>
        <Footer/>
    </div>
};
