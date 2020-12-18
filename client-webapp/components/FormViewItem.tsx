import React from 'react';
import {
  TextInput
} from 'carbon-components-react';

import { Item } from '../model';
import { capitalize } from '../core/util';

type Props = {
  item: Item;
}

const FormViewItem = (props: Props) => {
  return (
    <>
      {
        props.item.values.map((value) => (
          <TextInput
            id={value.ID.toString()}
            key={value.ID}
            style={{ marginBottom: "1rem" }}
            value={value.value}
            labelText={capitalize(value.fieldDefinition.verboseName)}
          />
        ))
      }
    </>
  )
};

export default FormViewItem;