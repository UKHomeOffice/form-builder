import React from 'react';
import useRoles from "../../common/useRoles";
import {Button} from 'semantic-ui-react'
import useEnvContext from "../../../../core/context/useEnvContext";
import {useTranslation} from "react-i18next";
import DeleteFormButton from "../../common/components/DeleteFormButton";
import {isMobile} from 'react-device-detect';

const ButtonGroup = ({  form,
                         handleOnSuccessfulDeletion,
                         handleEditForm,
                         handlePreview,
                         handlePromotion
                     }) => {
    const {canPromote, canEdit} = useRoles();
    const {envContext} = useEnvContext();
    const {t} = useTranslation();

    const deleteFormButton = <DeleteFormButton form={form}
                                               onSuccessfulDeletion={() => handleOnSuccessfulDeletion(form.id)}/>;
    const editButton = <Button data-cy="edit-form" positive
                               onClick={() => handleEditForm(form)}>{t('form.edit.label')}</Button>;
    const previewButton = <Button primary data-cy="preview-form"
                                  onClick={() => handlePreview(form)}>{t('form.preview.label')}</Button>;
    const promoteButton = <Button secondary data-cy="promote-form"
                                  onClick={() => handlePromotion(form)}>{t('form.promote.label')}</Button>;
    return isMobile ? <div className={canEdit() ? 'ui stackable four buttons container' : 'ui stackable one buttons container'}>
        {deleteFormButton}
        {envContext.editable ? editButton : null}
        {previewButton}
        {canPromote() ? promoteButton : null}
    </div> : <Button.Group>
        {canEdit() ? <React.Fragment>
            {deleteFormButton}
            {envContext.editable ? <React.Fragment><Button.Or/>{editButton}</React.Fragment> : null}
            <Button.Or/>
        </React.Fragment> : null}
        {previewButton}
        {canPromote() ? <React.Fragment><Button.Or/>{promoteButton}</React.Fragment> : null}
    </Button.Group>

};

export default ButtonGroup;
