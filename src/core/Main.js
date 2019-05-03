import React, {useState} from 'react';
import Header from "../common/Header";
import Footer from "../common/Footer";
import {NavNotFoundBoundary} from "react-navi";
import PageNotFound from "../common/PageNotFound";
import {Container} from 'semantic-ui-react';
import Notification from "../common/Notification";

export const NotificationContext = React.createContext([{}, () => {}]);

export const Main = ({children}) => {
    const [notification, setNotification] = useState({});
    return <div>
        <Header/>
        <Container>
            <NotificationContext.Provider value={[notification, setNotification]}>
                <Notification/>
                <NavNotFoundBoundary render={PageNotFound}>
                    {children || null}
                </NavNotFoundBoundary>
            </NotificationContext.Provider>
        </Container>
        <Footer/>
    </div>
};
