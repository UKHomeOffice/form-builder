import React from 'react';
import {useCurrentRoute} from 'react-navi'

const Home = () => {
    const route = useCurrentRoute();
    console.log(route.url);
    return <div>
        Hello
    </div>;
};

export default Home;
