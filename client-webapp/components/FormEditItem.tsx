import { TextInput } from 'carbon-components-react';
import React, { ChangeEvent } from 'react';

import { Item } from '../model';
import { capitalize } from '../core/util';

type Props = {
  item: Item;
  fields: { [key: string] : string };
  onFieldChange: (name: string) => (e: ChangeEvent<HTMLInputElement>) => void;
}

export default class FormEditItem extends React.PureComponent<Props> {
  public render() {
    return (
      <>
        {
          this.props.item.values.map((value) => (
            <TextInput
            id={value.ID.toString()}
              key={value.ID}
              labelText={capitalize(value.fieldDefinition.verboseName)}
              style={{ marginBottom: "1rem" }}
              value={this.props.fields[value.fieldDefinition.name]}
              onChange={this.props.onFieldChange(value.fieldDefinition.name)}
            />
          ))
        }
      </>
    )
  }
}