const messages = {
    "loading" : "Loading",
    "yes" : "Yes",
    "no": "No",
    "home": {
        "environments" :"Environments",
        "reports" : "Reports",
        "types-of-forms" : "Types of forms in each environment",
        "forms-per-environment": "Number of forms in each environment",
        "heading": {
            "title" : "Dashboard",
            "sub-heading" : "Central form management tool"
        }
    },
    "environment": {
        "label" : "Current environment context",
        "create" : "Form builder allowed: {{editable}}",
        "url" : "{{url}}"

    },
    "menu" : {
        "home" : {
            "label" : "Home",
            "name" : "/home"
        },
        "forms" : {
            "label" : "Forms",
            "name" : "/forms"
        },
        "logout" : {
            "label" : "Logout",
            "name" : "logout"
        }
    },
    "error" : {
        "general" : "An error occurred",
        "no-context": "An environment context has not been selected",
        "no-context-message": "You need to select an environment context in order to create forms"
    },
    "form": {
        "loading-form" : "Loading form",
        "download": {
            "successful" : "Download successful",
            "successful-message" : "{{formName}} successfully downloaded to your local machine",
            "failed": "Download failed",
            "failed-message" : "Please try again"
        },
        "promote" : {
            "confirm" : "Confirm form promotion",
            "header" : "Form promotion",
            "label": "Promote",
            "environment" : "Promote to {{env}}",
            "previous" : "Previous",
            "next" : "Next",
            "promote-action" : "Promote"
        },
        "create": {
            "file-upload" : {
                "no-form-content" : "No form content found"
            },
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
            "updating-label" :"Creating form....",
            "update-label" : "Create form",
            "form-type" : {
                "select": "Select form type",
                "select-placeholder": "Form type",
                "wizard": "Wizard",
                "form": "Form"
            },
            "form-name": {
                "placeholder": "Form name",
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
                    "missing-title": "No title defined for form",
                    "missing-form" : {
                        "title" : "No form",
                        "message": "You have not created a form to preview"
                    }
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
            "submission-warning-description": "Data submitted is held in the context of this page and lost when you navigate away.",
            "parsing-form" : "Parsing form fields"
        },
        "edit": {
            "label" : "Edit",
            "failure" : {
                "form-load": "Failed to load form due to {{error}}",
                "missing-form" : "Form {{formId}} does not exist",
                "unknown-error": "Failed to load form due to connectivity issues"
            },
            "form-type" : {
                "select": "Select form type",
                "select-placeholder": "Form type",
                "wizard": "Wizard",
                "form": "Form"
            },
            "form-name": {
                "placeholder": "Form name",
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
            "updating-label" :"Updating form....",
            "update-label" : "Update form"
        },
        "list": {
            "loading" : "Loading forms...",
            "total-forms": "User created forms in {{env}}",
            "total-form-type": "form types",
            "total-wizard-type": "wizard types",
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
