import { UI, CLI } from 'aurelia-cli';

export default class CommandHandler {

  public handle(projectDirectory: string, command: string, args: Array<any>) {
    console.log('handle: ' + command);
    let cli = new CLI();
    cli.options.runningLocally = true;
    cli.options.originalBaseDir = projectDirectory;

    //cli.ui = new VsCodeUI();
    //cli.container.registerInstance(UI, new VsCodeUI());


    let commandName = '';
    let commandArgs = [];
    switch(command) {
        case 'aurelia-cli.new': 
          commandName = 'new';
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
        console.log(error);
    });
  }
}

class VsCodeUI {
  open() {
    console.log('open');
  }

  close() {
    console.log('close');
  }

  log(text: string) {
    console.log('log:' + text);
    
  }

  ensureAnswer(answer, question, suggestion) {
    console.log('ensureAnswer:' + question);
  }

  question(text, optionsOrSuggestion) {
    console.log('question:' + text);
  }

  multiselect(question, options) {
    console.log('multiselect:' + question)
  }

  displayLogo() {
    console.log('displayLogo');
  }

  clearScreen() {
    console.log('clearScreen');
  }
}
