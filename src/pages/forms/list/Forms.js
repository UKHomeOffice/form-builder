import React from 'react';
import {mount, route} from 'navi'
import FormList from "./components/FormList";

export default mount({
    '/': route({
        async getView(request) {
            const forms = await Promise.resolve([{
                id: 'formId',
                name: 'formName'
            }]);
            return <Forms forms={forms}/>
        }
    })
})
const Forms = ({forms}) => {
    return <FormList forms={forms}/>
};


