import { CLI } from 'aurelia-cli';
import * as ui from 'aurelia-cli/lib/ui';
import { Container } from 'aurelia-dependency-injection';
import { RequestType } from 'vscode-languageclient';


export default class CommandHandler {

  constructor(private sendRequest: <R>(method: string, ...params: any[]) => Thenable<R>) {
    
  }

  public handle(projectDirectory: string, command: string, args: Array<any>) {
    console.log('handle: ' + command);
    let cli = new CLI();
    cli.options.runningLocally = true;
    cli.options.originalBaseDir = projectDirectory;
    cli.ui = new VsCodeUI(this.sendRequest);

    console.log('projectDirectory: ' + projectDirectory);

    // Replace UI
    (<Container>cli.container).unregister(ui.UI);
    cli.container.registerInstance(ui.UI, cli.ui);


    let commandName = '';
    let commandArgs = [];
    switch(command) {
        case 'aurelia-cli.new': 
          commandName = 'new';
          commandArgs.push('--here');
        break;
        case 'aurelia-cli.generate': 
          commandName = 'generate';
        break;
        case 'aurelia-cli.build':
          commandName = 'build';
        break;
        case 'aurelia-cli.test':
          commandName = 'test';
        break;
        case 'aurelia-cli.run':
          commandName = 'run';
        break;
        case 'aurelia-cli.run-watch':
          commandName = 'run';
          commandArgs.push('watch');
        break;
    }

    cli.run(commandName, commandArgs).catch((error) => {
        console.log('error');
        console.dir(error);
    });
  }
}

class VsCodeUI {

  constructor(private sendRequest: <R>(method: string, ...params: any[]) => Thenable<R>) {}

  open() {
  }

  close() {
  }

  log(text: string) {
    console.log(text);
    return Promise.resolve();
  }

  ensureAnswer(answer, question, suggestion) {
    console.log('ensureAnswer: ' + question);
    return this.sendRequest('aurelia-cli.ui.ensureAnswer', answer, question, suggestion);    
  }

  question(text, optionsOrSuggestion) {
    console.log('question: ' + text);
    return new Promise((resolve, reject) => {
      this.sendRequest('aurelia-cli.ui.question', text, optionsOrSuggestion).then((answer:any) => {
        if (!answer) {
          console.log('!answer');
          reject();
        }         
        resolve({ value: answer.label });
      });
    });
  }

  multiselect(question, options) {
    console.log('aurelia-cli.ui.multiselect');
    this.sendRequest('aurelia-cli.ui.multiselect', question, options);
  }

  displayLogo() {
    return Promise.resolve();
  }

  clearScreen() {
    return Promise.resolve();
  } 
}
