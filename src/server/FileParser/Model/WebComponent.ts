import {HtmlTemplateDocument} from './HtmlTemplateDocument';
import {ViewModelDocument} from './ViewModelDocument';

export class WebComponent {

  public classes = [];
  public document: HtmlTemplateDocument;
  public viewModel: ViewModelDocument;
  public paths = [];

  constructor(public name: string) {

  }
}
