const messages = {
    "loading": "Loading...",
    "yes": "Yes",
    "no": "No",
    "home": {
        "environments": "Environments",
        "reports": "Reports",
        "types-of-forms": "Types of forms in each environment",
        "forms-per-environment": "Number of forms in each environment",
        "heading": {
            "title": "Dashboard",
            "sub-heading": "Central form management tool"
        },
        "failure": {
            "reports": "Failed to get report data from {{url}} due to {{error}}"
        }
    },
    "environment": {
        "label": "Current environment context",
        "create": "Form builder allowed: {{editable}}",
        "url": "{{url}}"

    },
    "menu": {
        "migration": {
            "name": "/migrations",
            "label": "Migration"
        },
        "home": {
            "label": "Home",
            "name": "/home"
        },
        "forms": {
            "label": "Forms",
            "name": "/forms"
        },
        "logout": {
            "label": "Logout",
            "name": "logout"
        }
    },
    "error": {
        "not-found": "Sorry the url you requested does not exist",
        "not-authorized": "Sorry you do not have the necessary privileges to access this application. Please contact your support team",
        "general": "An error occurred",
        "no-context": "An environment context has not been selected",
        "no-context-message": "You need to select an environment context in order to create forms",
        "component-error": "Rendering of a component failed. Please consult console logs for more information"
    },
    "comments": {
        "loading": "Loading comments",
        "success": {
            "created": "Your comment was successfully added"
        },
        "failure": {
            "comments-load": "Failed to load comments {{error}}",
            "create-comment": "Failed to create new comment due to {{error}}"
        }
    },
    "versions": {
        "loading": "Loading versions",
        "failure": {
            "versions-load": "Failed to loaded versions {{error}}"
        }
    },
    "migration": {
        "confirm-header": 'Migrate old formio forms to new platform',
        "confirm-content": "Are you sure you want to migrate the old forms to new platform?",
        "title": "Formio migration",
        "description": "Migrate Formio forms to new platform",
        "migration-action-label": "Migrate forms to {{env}}",
        "migration-button-label": "Migrate",
        "migration-all-button-label": "Migrate all on page",
        "failed-to-migrate": "Failed to migrate {{formName}}",
        "failure": {
            "title": "Failed migration",
            "description": "Failed to migrate {{formName}}",
            "failed-to-load": "Failed to load forms from source due to {{error}}"
        },
        "migrating-label": "Migrating",
        "success": {
            "title": "Successful migration",
            "description": "{{formName}} successfully migrated"
        }
    },
    "form": {
        "details": "Form details",
        "restore": {
            "success-title": "Successful version restore",
            "success-description": "{{versionId}} has been restored to latest",
            "failure": "Failed to restore form to latest due {{error}}"

        },
        "loading-form": "Loading form",
        "download": {
            "label": "Download",
            "successful": "Download successful",
            "successful-message": "{{formName}} successfully downloaded to your local machine",
            "failed": "Download failed",
            "failed-message": "Please try again"
        },
        "promote": {
            "no-environments-to-promote-title": "No available environment",
            "no-environments-to-promote-description": "Please check your application configuration. No promotable environment available",
            "promoting-label": "Promoting form...",
            "confirm": "Confirm form promotion",
            "header": "Form promotion",
            "label": "Promote",
            "environment": "Promote to {{env}}",
            "previous": "Previous",
            "next": "Next",
            "promote-action": "Promote",
            "failed-to-load-form": "Failed to load form due to {{error}}",
            "successful-title": "{{formName}} successfully promoted",
            "successful-description": "{{formName}} has been successfully promoted to {{env}}",
            "failed-to-promote": "Failed to promote {{formName}} due to {{error}}",
            "approval": {
                "successful-title": "{{formName}} successfully submitted for approval",
                "successful-description": "{{formName}} has been successfully sent for approval. Form to be promoted to {{env}}",
            }
        },
        "unsaved": {
            "data": {
                "detected-local-changes-title": "Unsaved local changes detected",
                "detected-local-changes": "Please confirm whether you would like to load local changes to create a form",
                "button-load": "Load local changes",
                "button-cancel": "Ignore local changes"
            }

        },
        "create": {
            "unsaved": {
                "data": {
                    "title": "Unsaved form data",
                    "description": "You have created a form schema. If you navigate away from this page you will lose your data. Please ensure you save using 'Create form'",

                }
            },
            "file-upload": {
                "no-form-content": "No form content found"
            },
            "duplicate": {
                "no-form-content": "No form content found"
            },
            "not-allowed": {
                "title": "Not allowed",
                "message": "{{environment}} context does not allow creation of forms directly"
            },
            "choice": {
                "label": "Create a form using builder or upload an existing json file",
                "form-builder-label": "Form builder",
                "form-upload-label": "Form upload"
            },
            "label": "Create form",
            "creating-label": "Creating...",
            "failure": {
                "failed-to-create": "Failed to create form due to {{error}}",
                "invalid-json": "Failed to parse the file, possibly invalid JSON"
            },
            "updating-label": "Creating form....",
            "update-label": "Create form",
            "form-type": {
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
                "placeholder": "Form title",
                "label": "Title",
                "missing": "Form title is required for creating a form"
            },
            "actions": "Actions",
            "preview": {
                "modal": {
                    "missing-title": "No title defined for form",
                    "missing-form": {
                        "title": "No form",
                        "message": "You have not created a form to preview"
                    }
                }
            }

        },
        "submission": {
            "schema": {
                "view": "View Submission Schema",
                "label": "Submission schema for {{formName}}"
            }
        },
        "delete": {
            "confirm": "Are you sure you want to delete {{formName}}?",
            "successful": "Successfully deleted {{formName}}",
            "message": {
                "header": "Just one second",
                "content": "Deleting form"
            },
            "failure": {
                "failed-to-delete": "Failed to delete {{formName}} due to {{error}}"
            }
        },
        "cancel": {
            "label": "Cancel"
        },
        "schema": {
            "label": "Form schema view",
            "view": "View form schema",
            "edit": {
                "label": "Edit schema",
                "advanced-usage": "Direct form schema editing is for advanced users only"
            }
        },
        "preview": {
            "duplicate": "Duplicate form",
            "back-to-forms": "Back to {{env}} forms",
            "failure": {
                "gov-uk-not-configured": "Gov UK styling is not configured"
            },
            "govuk": {
                "header": "UK Gov styling preview",
                "open": "Preview in UK Gov styling"
            },
            "label": "Preview",
            "form-submission-label": "Form submission",
            "submission-warning-title": "Submission is not persisted in preview mode",
            "submission-warning-description": "Data submitted is held in the context of this page and lost when you navigate away.",
            "parsing-form": "Parsing form fields"
        },
        "edit": {
            "label": "Edit",
            "label-form": "Edit form",
            "label-formbuilder" : "Edit with builder",
            "failure": {
                "form-load": "Failed to load form due to {{error}}",
                "missing-form": "Form {{formId}} does not exist",
                "unknown-error": "Failed to load form due to connectivity issues",
                "non-editable-environment": "You cannot edit this form directly. Use promotion process"
            },
            "unsaved": {
                "data": {
                    "title": "Unsaved form data",
                    "description": "If you navigate away from this page you will lose your unsaved data. Please ensure you save using 'Update form'",
                }
            },
            "form-type": {
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
                "placeholder": "Form title",
                "label": "Title",
                "missing": "Form title is required for creating a form"
            },
            "updating-label": "Updating form....",
            "update-label": "Update form"
        },
        "list": {
            "loading": "Loading forms...",
            "total-forms": "Total forms in {{env}}",
            "total-form-type": "Form types",
            "total-wizard-type": "Wizard types",
            "failure": {
                "unknown-error": "connectivity issues with form server",
                "forms-load": "Failed to load forms due to {{error}}"
            },
            "delete-label": "Delete",
            "search-label": "Search by title...",
            "table": {
                "formIdentifierCellLabel": "Form Identifier",
                "formTitleCellLabel": "Title",
                "formNameCellLabel": "Name",
                "formPathCellLabel": "Path",
                "formTypeCellLabel": "Type",
                "formActionsCellLabel": "Actions"
            }
        }
    }
};
export default messages;
