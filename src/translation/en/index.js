const messages = {
    "home": {
        "environments" :"Environments",
        "reports" : "Reports",
        "types-of-forms" : "Types of forms in each environment",
        "forms-per-environment": "Number of forms in each environment"
    },
    "environment": {
        "label" : "Current environment context"
    },
    "menu" : {
        "home" : "/home",
        "forms" : "Forms",
        "logout" : "logout"
    },
    "error" : {
        "general" : "An error occurred",
        "no-context": "An environment context has not been selected",
        "no-context-message": "You need to select an environment context in order to create forms"
    },
    "form": {
        "create": {
            "not-allowed": {
                "title": "Not allowed",
                "message": "Environment context does not allow creation of forms directly"
            },
            "choice": {
                "form-builder-label" : "Use builder",
                "form-upload-label" : "Form upload"
            },
            "label": "Create form",
            "creating-label" : "Creating...",
            "failure": {
                "failed-to-create": "Failed to create form due to {{error}}"
            },
            "form-type" : {
                "select": "Select form type",
                "select-placeholder": "Form type",
                "wizard": "Wizard",
                "form": "Form"
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
            },
            "preview" : {
                "modal" : {
                    "missing-title": "No title defined for form"
                }
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
            "submission-warning-title": "Submission is not persisted in preview mode",
            "submission-warning-description": "Data submitted is held in the context of this page and lost when you navigate away."
        },
        "edit": {
            "label" : "Edit"
        },
        "list": {
            "failure": {
                "unknown-error" : "connectivity issues with form server",
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
