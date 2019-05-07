const messages = {
    "environment": {
        "label" : "Environment"
    },
    "menu" : {
        "home" : "/home",
        "forms" : "/forms",
        "logout" : "logout"
    },
    "error" : {
        "general" : "An error occurred"
    },
    "form": {
        "create": {
            "choice": {
                "form-builder-label" : "Use builder",
                "form-upload-label" : "Form upload"
            },
            "label": "Create form",
            "creating-label" :"Creating...",
            "failure": {
                "failed-to-create": "Failed to create form due to {{error}}"
            },
            "form-type" : {
                "select": "Select form type",
                "select-placeholder": "Form type"
            },
            "form-name": {
                "placeholder": "Form title",
                "label": "Name",
                "missing": "Form name is required for creating a form"
            },
            "form-path": {
                "placeholder": "Form path",
                "label": "Path",
                "missing": "Form path is required for creating a form"
            },
            "form-title": {
                "placeholder" : "Form title",
                "label": "Title",
                "missing": "Form title is required for creating a form"
            }

        },
        "delete" : {
            "confirm" : "Are you sure you want to delete {{formName}}?",
            "successful" : "Successfully deleted {{formName}}",
            "message" : {
                "header": "Just one second",
                "content": "Deleting form"
            },
            "failure": {
                "failed-to-delete" : "Failed to delete {{formName}} due to {{error}}"
            }
        },
        "cancel": {
            "label":"Cancel"
        },
        "preview" : {
            "label" : "Preview",
            "form-submission-label" : "Form submission",
            "submission-warning-title": "Submission is not persisted",
            "submission-warning-description": "Data submitted is held in the context of this page and lost when you navigate away."
        },
        "edit": {
            "label" : "Edit"
        },
        "list": {
            "failure": {
                "forms-load": "Failed to load forms due to {{error}}"
            },
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
export default messages;
