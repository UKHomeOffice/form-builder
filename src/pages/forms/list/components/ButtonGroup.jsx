import React from 'react';
import useRoles from "../../common/useRoles";
import useEnvContext from "../../../../core/context/useEnvContext";
import {useTranslation} from "react-i18next";
import DeleteFormButton from "../../common/components/DeleteFormButton";
import Button from "react-bootstrap/Button";

const ButtonGroup = ({  form,
                         handleOnSuccessfulDeletion,
                         handleEditForm,
                         handlePreview,
                         handlePromotion
                     }) => {
    const {canPromote, canEdit} = useRoles();
    const {envContext} = useEnvContext();
    const {t} = useTranslation();

    // const deleteFormButton = ;

     return <div className="container">
         <div className="row grid-divider">
             {canEdit() ? <React.Fragment>
                 <div className="col my-1">
                     <DeleteFormButton form={form} onSuccessfulDeletion={() => handleOnSuccessfulDeletion(form.id)}/>
                 </div>
                 {envContext.editable ? <React.Fragment>
                     <div className="col my-1">
                         <Button data-cy="edit-form"
                                 block variant="primary"
                                 size="sm"
                                 onClick={() => handleEditForm(form)}>{t('form.edit.label')}</Button>
                     </div>
                 </React.Fragment> : null}
             </React.Fragment> : null}

             <div className="col my-1">
                 <Button data-cy="preview-form"
                         block variant="info"
                         size="sm"
                         onClick={() => handlePreview(form)}>{t('form.preview.label')}</Button>
             </div>
             {canPromote()? <div className="col my-1">
                 <Button data-cy="promote-form"
                         block variant="dark" size="sm"
                         onClick={() => handlePromotion(form)}>{t('form.promote.label')}</Button>
             </div> : null}
         </div>
     </div>




};

export default ButtonGroup;
