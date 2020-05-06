# Change Log
# 2.4.1
### Updated
 - GDS Formio template to 1.5.0
 
# 2.4.0
### Updated
 - GDS Formio template to 1.4.9
 - Formio Upgrade 4.9.5
 
### Fixed
 - Form list view on mobile
 - https://github.com/DigitalPatterns/form-builder/issues/56
 - New form created takes user back to preview of the form instead of list page
    

# 2.3.2
### Updated
 - GDS Formio template to 1.2.4

# 2.3.1
### Fixed
 - [Preview in edit mode breaks](https://github.com/DigitalPatterns/form-builder/issues/51)
 - Upgraded dependencies
 - Realigned schema view json editor with rest of builder
    
# 2.3.0
### Added
 - Ability to edit form in raw editor mode and switch back to builder without losing changes
### Updated
 - GDS Template to 1.2.2 

# 2.2.8
### Fixed:
 - Nested forms not getting data context resolved
  
# 2.2.7
### Fixed:
 - Sub form promotion. Incorrect sub form look url, as a result sometimes sub form was not being promoted.
 - Added additional logs in Promotion Controller for better debugging
 - Fixed issue if a form has multiple sub forms of the same reference then promotion would create duplicates
# 2.2.6
### Update:
 - upgrade formio gds template to 1.2.1
 - upgrade formio to 4.7.8

# 2.2.5
### Update:
 - upgrade formio gds template to 1.2.0
 - added option to specify application config file location for server using APP_CONFIG_LOCATION (must be full path)
 
# 2.2.4
### Update:
 - formiojs upgrade to 4.7.7
 
# 2.2.3
### Update:
 - @digitalpatterns/formio-gds-template upgrade to 1.1.9
 
# 2.2.2
### Feature:
 - Ability to promote a specific version in the promotion screen
 - Ability to edit schema directly in code, text and tree mode
### Update:
 - Formio 4.7.5 upgrade
 - @digitalpatterns/formio-gds-template upgrade to 1.1.6


# 2.2.1
### Fix:
 - Preview page not showing submission data
 
# 2.2.0
### Update:
 - Upgraded react-formio to 4.2.3
 - Removed formiojs from package.json
 - Upgraded @digitalpatterns/formio-gds-template to 1.1.0
 
# 2.1.2
### Update:
 - Downgrading to formio 4.7.0 due to DayComponent not working
 
# 2.1.1
### Update:
 - Fixed Dockerfile copy gov uk assets
 
# 2.1.0
### Update:
 - Upgrade of formio to 4.7.1
 - Upgrade of @digtialpatterns/formio-gds-template 1.0.7
 - Upgrade package-lock.json
 
# 2.0.9
### Update:
 - Upgrade of formio to 4.7.0
 - Upgrade of @digtialpatterns/formio-gds-template 1.0.6
 - Upgrade package-lock.json
 
# 2.0.8
### Update:
 - Upgrade of formio to 4.6.2
 - Gov UK Preview page using new formio template architecture
 - @digitalpatterns/formio-gds-template 1.0.5
 - removed old template file for gds template
 - removed govuk frontend dependency as this is now a transient dependency of @digitalpatterns/formio-gds-template

# 2.0.7
### Update:
- Upgrade of formio to 4.5.0
- Update package-lock.json of client directory  
- Fixed SubFormComponent

# 2.0.7
### Update:
- Upgrade of formio to 4.4.2
- Update package-lock.json of client directory  
    
# 2.0.6
### Update:
- Upgrade of formio to 4.4.1
- Update package-lock.json of client directory  
    
# 2.0.5
### Update:
- Upgrade of formio to 4.3.5
- Update package-lock.json of client directory  

# 2.0.4
### Fixes:
- Formio migration issue
    
# 2.0.3
### Update:
- Upgrade of formio to 4.3.3
- Update package-lock.json of client directory    
    
# 2.0.2
### Update:
- Upgrade of formio to 4.3.1
- Update package-lock.json of client directory
    
# 2.0.1
### Update:
- Removed x-user-email from PreviewComponent

# 2.0.0
### Fixes:
- Bumped version to 2.0.0
- Select box automatically resetting item template
- Fixes sub form submission
- Upgrade of FormioJS to 4.2.12
- Upgrade of package-lock.json

# 1.0
### Fixed:
- https://github.com/DigitalPatterns/form-builder/issues/1
- https://github.com/DigitalPatterns/form-builder/issues/2
- https://github.com/DigitalPatterns/form-builder/issues/3
- https://github.com/DigitalPatterns/form-builder/issues/4
- https://github.com/DigitalPatterns/form-builder/issues/5
- https://github.com/DigitalPatterns/form-builder/issues/6
- https://github.com/DigitalPatterns/form-builder/issues/10
- https://github.com/DigitalPatterns/form-builder/issues/13
