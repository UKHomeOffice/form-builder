import React from 'react';
import FormDetail from "./FormDetail";

const FormList = ({forms}) => {
    const formsToDisplay = forms.map((form) => {
        return <FormDetail key={form.id} form={form}/>
    });
    return <div>{formsToDisplay}</div>
};

export default FormList;
