import React from 'react';
import {mount, route} from 'navi'
import FormList from "./components/FormList";
import axios from "axios";

export default mount({
    '/': route({
        async getView(request) {
            const forms = await axios.get(`${process.env.REACT_APP_FORMIO_URL}/form?select=title,path,name,display`)
                .then(res => res.data);
            return <FormList forms={forms}/>
        }
    })
})
