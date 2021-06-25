import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SaketaAdpWebPartWebPartStrings';
import SaketaAdpWebPart from './components/SaketaAdpWebPart';
import { ISaketaAdpWebPartProps } from './components/ISaketaAdpWebPartProps';
import { sp } from "@pnp/sp";

export interface ISaketaAdpWebPartWebPartProps {
  description: string;
}

export default class SaketaAdpWebPartWebPart extends BaseClientSideWebPart<ISaketaAdpWebPartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISaketaAdpWebPartProps> = React.createElement(
      SaketaAdpWebPart,
      {
        description: this.properties.description,
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }
  protected onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context
    });
    return super.onInit();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
