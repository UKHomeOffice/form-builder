import React from 'react';
import Header from "../common/Header";
import Footer from "../common/Footer";
import {NavNotFoundBoundary} from "react-navi";
import PageNotFound from "../common/PageNotFound";

export const Main = ({children}) => {
    return <div>
        <Header/>
        <div className="ui container" style={{paddingTop: '10px'}}>
            <NavNotFoundBoundary render={PageNotFound}>
                {children || null}
            </NavNotFoundBoundary>
        </div>
        <Footer/>
    </div>
};
