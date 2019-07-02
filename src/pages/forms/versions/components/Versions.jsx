import React from 'react';
import useGetVersions from "../useGetVersions";
import {Message} from "semantic-ui-react";

const Versions = ({formId}) => {
    const {versions} = useGetVersions(formId);
    return <Message
        icon='calendar alternate outline'
        header='Form versions'
        content='Coming soon'
    />
};


export default Versions;
