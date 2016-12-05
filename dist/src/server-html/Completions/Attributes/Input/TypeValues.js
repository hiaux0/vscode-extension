"use strict";
const vscode_languageserver_1 = require('vscode-languageserver');
function ValueValues() {
    let result = [];
    result.push(this.createAttribute(`button`, `A push button with no default behavior.`));
    result.push(this.createAttribute(`checkbox`, `A check box. You must use the value attribute to define` +
        `the value submitted by this item. Use the checked attribute to indicate whether this item is selected.` +
        `You can also use the indeterminate attribute (which can only be set programmatically) to indicate that` +
        `the checkbox is in an indeterminate state ` +
        `(on most platforms, this draws a horizontal line across the checkbox).`));
    result.push(this.createAttribute(`color`, `(HTML5) A control for specifying a color. A color picker's UI has no` +
        `required features other than accepting simple colors as text.`));
    result.push(this.createAttribute(`date`, `(HTML5) A control for entering a date (year, month, and day, with no time)`));
    result.push(this.createAttribute(`datetime-local`, `(HTML5) A control for entering a date and time, with no time zone.`));
    result.push(this.createAttribute(`email`, `(HTML5) A field for editing an e-mail address. The input value is validated to ` +
        `contain either the empty string or a single valid e-mail address before submitting. The :valid and :invalid CSS ` +
        `pseudo-classes are applied as appropriate.`));
    result.push(this.createAttribute(`file`, `A control that lets the user select a file. Use the accept attribute ` +
        `to define the types of files that the control can select.`));
    result.push(this.createAttribute(`hidden`, `A control that is not displayed but whose value is submitted to the server.`));
    result.push(this.createAttribute(`image`, `A graphical submit button. You must use the src attribute to define the source of ` +
        `the image and the alt attribute to define alternative text. You can use the height and width attributes to define the size ` +
        `of the image in pixels.`));
    result.push(this.createAttribute(`month`, `(HTML5) A control for entering a month and year, with no time zone.`));
    result.push(this.createAttribute(`number`, `(HTML5) A control for entering a floating point number.`));
    result.push(this.createAttribute(`password`, `A single-line text field whose value is obscured. Use the maxlength attribute ` +
        `to specify the maximum length of the value that can be entered.`));
    result.push(this.createAttribute(`radio`, `A radio button. You must use the value attribute to define the value submitted ` +
        `by this item. Use the checked attribute to indicate whether this item is selected by default. Radio buttons that have the ` +
        `same value for the name attribute are in the same "radio button group". Only one radio button in a group can be selected ` +
        `at a time.`));
    result.push(this.createAttribute(`range`, `(HTML5) A control for entering a number whose exact value is not important. This type control ` +
        `uses the following default values if the corresponding attributes are not specified:
      
      min: 0
      max: 100
      value: min + (max - min) / 2, or min if max is less than min
      step: 1`));
    result.push(this.createAttribute(`reset`, `A button that resets the contents of the form to default values.`));
    result.push(this.createAttribute(`search`, `(HTML5) A single-line text field for entering search strings. Line-breaks are automatically ` +
        `removed from the input value.`));
    result.push(this.createAttribute(`submit`, `A button that submits the form.`));
    result.push(this.createAttribute(`tel`, `(HTML5) A control for entering a telephone number. Line-breaks are automatically removed from the ` +
        `input value, but no other syntax is enforced. You can use attributes such as pattern and maxlength to restrict values entered in ` +
        `the control. The :valid and :invalid CSS pseudo-classes are applied as appropriate.`));
    result.push(this.createAttribute(`text`, `A single-line text field. Line-breaks are automatically removed from the input value.`));
    result.push(this.createAttribute(`time`, `(HTML5) A control for entering a time value with no time zone.`));
    result.push(this.createAttribute(`url`, `(HTML5) A field for editing a URL. The input value is validated to contain either the empty string or ` +
        `a valid absolute URL before submitting. Line-breaks and leading or trailing whitespace are automatically removed from the input value. ` +
        `You can use attributes such as pattern and maxlength to restrict values entered in the control. The :valid and :invalid CSS ` +
        `pseudo-classes are applied as appropriate.`));
    result.push(this.createAttribute(`week`, `(HTML5) A control for entering a date consisting of a week-year number and a week number with no time zone.`));
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ValueValues;
function createAttribute(name, documentation) {
    return {
        documentation: documentation,
        kind: 12 /* Value */,
        label: name,
        insertText: vscode_languageserver_1.SnippetString.create(name)
    };
}
//# sourceMappingURL=TypeValues.js.map