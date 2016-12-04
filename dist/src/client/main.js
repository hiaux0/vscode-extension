"use strict";
const vscode_1 = require('vscode');
const aureliaCLICommands_1 = require('./aureliaCLICommands');
const htmlInvalidCasingCodeActionProvider_1 = require('./htmlInvalidCasingCodeActionProvider');
let outputChannel;
function activate(context) {
    // Create default output channel
    outputChannel = vscode_1.window.createOutputChannel('aurelia');
    context.subscriptions.push(outputChannel);
    // Register CLI commands
    context.subscriptions.push(aureliaCLICommands_1.default.registerCommands(outputChannel));
    // Register code fix
    const invalidCasingAction = new htmlInvalidCasingCodeActionProvider_1.default();
    invalidCasingAction.activate(context.subscriptions);
    vscode_1.languages.registerCodeActionsProvider('html', invalidCasingAction);
}
exports.activate = activate;
//# sourceMappingURL=main.js.map