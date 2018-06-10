import { BaseElement } from './BaseElement';

export class MozDocElement extends BaseElement {
    public get licenceText() {
        return `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;
    }

    public permittedChildren: string[] = [];
    public notPermittedChildren: string[] = [];
    public permittedParents: string[] = [];
    public emptyElement: boolean = false;

    public ariaRoles: string[] = [];
    public areaRolesAllowed: boolean = true;
}
