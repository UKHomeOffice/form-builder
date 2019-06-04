const classes = {
    'has-error': 'govuk-form-group--error',
    'form-control ui fluid selection dropdown': 'form-control fluid selection dropdown govuk-select',
    'formio-day-component-month': 'formio-day-component-month govuk-date-input__input govuk-input--width-2',
    'formio-day-component-day': 'ormio-day-component-day govuk-date-input__input govuk-input--width-2',
    'formio-day-component-year': 'formio-day-component-year govuk-date-input__input govuk-input--width-4',
    'alert alert-danger': 'govuk-form-group--error'
};
const govukFormioTemplate = {
    datagrid: {
        form: `<table class="table datagrid-table table-bordered
            {{ component.striped ? 'table-striped' : ''}}
            {{ component.hover ? 'table-hover' : ''}}
            {{ component.condensed ? 'table-sm' : ''}}
            " {% if (component.layoutFixed) { %}style="table-layout: fixed;"{% } %}>
          {% if (hasHeader) { %}
          <thead>
            <tr>
              {% columns.forEach(function(col) { %}
              {% if (visibleColumns[col.key]) { %}
              <th class="{{col.validate && col.validate.required ? 'field-required' : ''}}">
                {{ col.hideLabel ? '' : t(col.label || col.title) }}
                {% if (col.tooltip) { %} <i ref="tooltip" class="{{iconClass('question-sign')}} text-muted" data-title="{{col.tooltip}}"></i>{% } %}
              </th>
              {% } %}
              {% }) %}
              {% if (hasExtraColumn) { %}
              <th>
                {% if (!builder && hasAddButton && hasTopSubmit) { %}
                <button class="govuk-button formio-button-add-row" ref="{{datagridKey}}-addRow">
                  <i class="{{iconClass('plus')}}"></i> Add Another
                </button>
                {% } %}
              </th>
              {% } %}
            </tr>
          </thead>
          {% } %}
          <tbody ref="{{datagridKey}}-tbody">
            {% rows.forEach(function(row) { %}
            {% if (hasGroups && groups[index]) { %}
            <tr ref="{{datagridKey}}-group-header" class="datagrid-group-header{{hasToggle ? ' clickable' : ''}}">
              <td
                ref="{{datagridKey}}-group-label"
                colspan="{{numColumns}}"
                class="datagrid-group-label">{{groups[index].label}}</td>
            </tr>
            {% } %}
            <tr ref="{{datagridKey}}-row">
              {% columns.forEach(function(col) { %}
              {% if (visibleColumns[col.key]) { %}
              <td ref="{{datagridKey}}">
                {{row[col.key]}}
              </td>
              {% } %}
              {% }) %}
              {% if (hasExtraColumn && (removePlacement === 'col')) { %}
                {% if (!builder && hasRemoveButtons) { %}
                <td>
                  <button type="button" class="govuk-button btn button--secondary formio-button-remove-row" ref="{{datagridKey}}-removeRow">
                    <i class="{{iconClass('remove-circle')}}"></i>
                  </button>
                </td>
                {% } %}
                {% if (builder) { %}
                <td ref="{{key}}-container">
                  {{placeholder}}
                </td>
                {% } %}
              {% } else if (removePlacement === 'corner') { %}
                <button type="button" tabindex="-1" class="govuk-button btn button--secondary formio-{{ component.type }}-remove" ref="{{datagridKey}}-removeRow">
                  <i class="{{ iconClass('remove') }}"></i>
                </button>
              {% } %}
            </tr>
            {% }) %}
          </tbody>
          {% if (!builder && hasAddButton && hasBottomSubmit) { %}
          <tfoot>
            <tr>
              <td colspan="{{numColumns}}">
                <button class="govuk-button formio-button-add-row" ref="{{datagridKey}}-addRow">
                  <i class="{{iconClass('plus')}}"></i> {{t(component.addAnother || 'Add Another')}}
                </button>
              </td>
            </tr>
          </tfoot>
          {% } %}
        </table>`
    },
    button: {
        form: `
                  <{{input.type}}
                    ref="button"
                    {% for (var attr in input.attr) { %}
                    {{attr}}="{{input.attr[attr]}}{% if (attr==='class') { %} govuk-button {% } %}"
                    {% } %}
                  >
                  {% if (component.leftIcon) { %}<span class="{{component.leftIcon}}"></span>&nbsp;{% } %}
                  {{input.content}}
                  {% if (component.rightIcon) { %}&nbsp;<span class="{{component.rightIcon}}"></span>{% } %}
                  </{{input.type}}>
                  <div ref="buttonMessageContainer">
                    <span class="help-block" ref="buttonMessage"></span>
                  </div>
                  `
    },
    checkbox: {
        form: `
                    <div class="form-check govuk-checkboxes__item">
                      <{{input.type}}
                        ref="input"
                        {% for (var attr in input.attr) { %}
                        {{attr}}="{{input.attr[attr]}}{% if (attr==='class') { %} govuk-checkboxes__input {% } %}"
                        {% } %}
                        {% if (checked) { %}checked=true{% } %}
                        id="formio-checkbox-{{component.key}}"
                      >
                        {{input.content}}
                      </{{input.type}}>

                      <label class="{{input.labelClass}} form-check-label govuk-label govuk-checkboxes__label" for="formio-checkbox-{{component.key}}">
                        {% if (!self.labelIsHidden()) { %}<span>{{input.label}}</span>{% } %}
                        {% if (component.tooltip) { %}
                          <i ref="tooltip" class="{{iconClass('question-sign')}} text-muted"></i>
                        {% } %}
                      </label>

                    </div>
                    `
    },
    field: {
        form: `
                    {% if (!label.hidden && label.labelPosition !== 'bottom') { %}
                      <label class="col-form-label {{label.className}} govuk-label">
                        {{ t(component.label) }}
                      </label>
                    {% } %}
                    {% if (component.description) { %}
                      <div class="form-text text-muted govuk-hint">{{t(component.description)}}</div>
                    {% } %}
                    {{element}}
                    {% if (component.tooltip) { %}
                    <details class="govuk-details">
                      <summary class="govuk-details__summary">
                        <span class="govuk-details__summary-text">
                          {{component.tooltipTitle || 'Help'}}
                        </span>
                      </summary>
                      <div class="govuk-details__text">
                        {{component.tooltip}}
                      </div>
                    </details>
                    {% } %}
                    {% if (!label.hidden && label.labelPosition === 'bottom') { %}
                      <label class="{{label.className}}">{{t(component.label)}}
                      </label>
                    {% } %}
                  `
    },
    input: {
        form: `
                    {% if (component.prefix || component.suffix) { %}
                    <div class="input-group">
                    {% } %}
                    {% if (component.prefix) { %}
                    <div class="input-group-prepend" ref="prefix">
                      <span class="input-group-text">
                        {{component.prefix}}
                      </span>
                    </div>
                    {% } %}
                    <{{input.type}}
                      ref="{{input.ref ? input.ref : 'input'}}"
                      {% for (var attr in input.attr) { %}
                      {{attr}}="{{input.attr[attr]}}{% if (attr==='class') { if (input.type === 'textarea'){ %} govuk-textarea {% } else { %} govuk-input {%} } %}"
                      {% } %}
                    >{{input.content}}</{{input.type}}>
                    {% if (self.hasCounter) { %}
                    <span class="text-muted pull-right" ref="counter"></span>
                    {% } %}
                    {% if (component.suffix) { %}
                    <div class="input-group-append" ref="suffix">
                      <span class="input-group-text">
                        {{component.suffix}}
                      </span>
                    </div>
                    {% } %}
                    {% if (component.prefix || component.suffix) { %}
                    </div>
                    {% } %}
                  `
    },
    radio: {
        form: `
                    {%
                      var govukType;
                      switch (input.attr.type) {
                        case 'checkbox':
                          govukType = 'checkboxes';
                          break;
                        case 'radio':
                          govukType = 'radios';
                          break;
                      }
                     %}
                    <div class="govuk-{{govukType}}">
                      {% values.forEach(function(item) { %}
                      <div class="form-check{{inline ? '-inline' : ''}} govuk-{{govukType}}__item" ref="wrapper">
                        <{{input.type}}
                          ref="input"
                          {% for (var attr in input.attr) { %}
                          {{attr}}="{{input.attr[attr]}}{% if (attr==='class') { %} govuk-{{govukType}}__input {% } %}"
                          {% } %}
                          value="{{item.value}}"
                          {% if (value && (value === item.value || (typeof value === 'object' && value.hasOwnProperty(item.value) && value[item.value]))) { %}
                            checked=true
                          {% } %}
                          id="{{id}}{{row}}-{{item.value}}"
                        >
                        <label class="form-check-label govuk-label govuk-{{govukType}}__label" for="{{id}}{{row}}-{{item.value}}">
                          <span>{{t(item.label)}}</span>
                        </label>
                      </div>
                      {% }) %}
                    </div>
                  `
    },
    component: {
        form: `
                    <div id="{{id}}" class="{{classes}} form-group govuk-form-group"{% if (styles) { %} styles="{{styles}}"{% } %} ref="component">
                      {% if (visible) { %}
                      {{children}}
                      <div ref="messageContainer" class="formio-errors invalid-feedback govuk-error-message"></div>
                      {% } %}
                    </div>
                  `
    },
    panel: {
        form: `
                    <div class="govuk-card--borderless">
                      <div>
                        <span class="mb-0 card-title govuk-body govuk-!-font-size-19 govuk-!-font-weight-bold" ref="header">
                          {% if (component.collapsible) { %}
                            <i class="formio-collapse-icon {{iconClass(collapsed ? 'plus-square-o' : 'minus-square-o')}} text-muted" data-title="Collapse Panel"></i>
                          {% } %}
                          {{t(component.title)}}
                          {% if (component.tooltip) { %}
                            <i ref="tooltip" class="{{iconClass('question-sign')}} text-muted"></i>
                          {% } %}
                        </span>
                      </div>
                      {% if (!collapsed || (options.attachMode === 'builder')) { %}
                      <div class="govuk-card__content" ref="{{nestedKey}}">
                        {{children}}
                      </div>
                      {% } %}
                    </div>
                  `
    },
    tab: {
        form: `
                    <ul class="govuk-tabs__list">
                      {% component.components.forEach(function(tab, index) { %}
                      <li class="nav-item{{ currentTab === index ? ' active' : ''}} govuk-tabs__list-item" role="presentation" ref="{{tabLikey}}">
                        <a class="nav-link{{ currentTab === index ? ' active' : ''}} govuk-tabs__tab govuk-tabs__tab--selected" href="#{{tab.key}}" ref="{{tabLinkKey}}">{{t(tab.label)}}</a>
                      </li>
                      {% }) %}
                    </ul>
                    <div class="tab-content">
                      {% component.components.forEach(function(tab, index) { %}
                      <div role="tabpanel" class="tab-pane{{ currentTab === index ? ' active' : ''}}" ref="{{tabKey}}"">{{tabComponents[index]}}</div>
                      {% }) %}
                    </div>
                  `
    },
    select: {
        form: `
                    <select
                      ref="{{input.ref ? input.ref : 'selectContainer'}}"
                      {{ input.multiple ? 'multiple' : '' }}
                      {% for (var attr in input.attr) { %}
                      {{attr}}="{{input.attr[attr]}}{% if (attr==='class') { %} govuk-select {% } %}"
                      {% } %}
                    >{{selectOptions}}</select>
                  `
    },
    day: {
        form: `
                    <div class="govuk-date-input">
                      {% if (dayFirst && showDay) { %}
                      <div class="govuk-date-input__item">
                        <label for="{{component.key}}-day" class="govuk-label govuk-date-input__label">{{t('Day')}}</label>
                        <div>{{day}}</div>
                      </div>
                      {% } %}
                      {% if (showMonth) { %}
                      <div class="govuk-date-input__item">
                        <label for="{{component.key}}-month" class="govuk-label govuk-date-input__label">{{t('Month')}}</label>
                        <div>{{month}}</div>
                      </div>
                      {% } %}
                      {% if (!dayFirst && showDay) { %}
                      <div class="govuk-date-input__item">
                        <label for="{{component.key}}-day" class="govuk-label govuk-date-input__label">{{t('Day')}}</label>
                        <div>{{day}}</div>
                      </div>
                      {% } %}
                      {% if (showYear) { %}
                      <div class="govuk-date-input__item">
                        <label for="{{component.key}}-year" class="govuk-label govuk-date-input__label">{{t('Year')}}</label>
                        <div>{{year}}</div>
                      </div>
                      {% } %}
                    </div>
                    <input name="data[day]" type="hidden" class="form-control" lang="en" value="" ref="input">
                  `
    },
    wizard: {
        form: `
                    <div style="position: relative;">
                      <nav class="govuk-breadcrumbs" aria-label="navigation">
                        <ul class="govuk-breadcrumbs__list">
                          {% panels.forEach(function(panel, index) { %}
                          <li class="govuk-breadcrumbs__list-item{{currentPage === index ? ' active' : ''}}" style="">
                            {% if (currentPage === index) { %}
                            <span class="govuk-breadcrumbs__link" ref="{{wizardKey}}-link">{{panel.title}}</span>
                            {% } else { %}
                            <a href="#" class="govuk-breadcrumbs__link" ref="{{wizardKey}}-link">{{panel.title}}</a>
                            {% } %}
                          </li>
                          {% }) %}
                        </ul>
                      </nav>
                      <div class="wizard-page" ref="{{wizardKey}}">
                        {{components}}
                      </div>
                      {% if (buttons.cancel) { %}
                        <button class="govuk-button btn button--secondary btn-wizard-nav-cancel" ref="{{wizardKey}}-cancel">{{t('cancel')}}</button>
                      {% } %}
                      {% if (buttons.previous) { %}
                        <button class="govuk-button btn btn-primary btn-wizard-nav-previous" ref="{{wizardKey}}-previous">{{t('previous')}}</button>
                      {% } %}
                      {% if (buttons.next) { %}
                        <button class="govuk-button btn btn-primary btn-wizard-nav-next" ref="{{wizardKey}}-next">{{t('next')}}</button>
                      {% } %}
                      {% if (buttons.submit) { %}
                        <button class="govuk-button btn btn-primary btn-wizard-nav-submit" ref="{{wizardKey}}-submit">{{t('submit')}}</button>
                      {% } %}
                    </div>
                  `
    },
    cssClasses: classes
};

export default govukFormioTemplate;
