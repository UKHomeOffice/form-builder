import i18n from 'formiojs/i18n'
import _ from 'lodash';

const messages = {
    "error" : {
        "general" : "An error occurred"
    },
    "form": {
        "create": {
            "label": "Create form"
        },
        "preview" : {
            "form-submission-label" : "Form submission",
            "submission-warning-title": "Submission is not persisted",
            "submission-warning-description": "Data submitted is held in the context of this page and lost when you navigate away."
        },
        "list": {
            "failure": {
                "forms-load": "Failed to load forms due to {{error}}"
            },
            "edit-label" :"Edit",
            "preview-label": "Preview",
            "delete-label": "Delete",
            "search-label" :"Search by title...",
            "table" : {
                "formIdentifierCellLabel" : "Form Identifier",
                "formTitleCellLabel": "Title",
                "formNameCellLabel" : "Name",
                "formPathCellLabel": "Path",
                "formTypeCellLabel": "Type",
                "formActionsCellLabel": "Actions"
            }
        }
    }
};
export default _.merge(messages, i18n.resources.en.translation);
