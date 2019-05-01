import React, {useState} from "react";
import {Button, Confirm} from "semantic-ui-react";

const DeleteFormButton = ({form}) => {
    const [open, setOpen] = useState(false);
    return <div><Button negative onClick={() => setOpen(true)}>Delete</Button>
        <Confirm
            header={`${form.name}`}
            open={open}
            content={`Are you sure you wish to delete ${form.name}?`}
            onCancel={() => setOpen(false)}
            onConfirm={() => setOpen(false)}
            size='large'
        /></div>

};

export default DeleteFormButton;
