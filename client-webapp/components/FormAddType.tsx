import React, { ChangeEvent } from 'react';

import {
  Grid,
  Row,
  Column,
  TextInput,
  Button,
} from 'carbon-components-react';
import { Subtract20 } from '@carbon/icons-react';

type Props = {
  name: string;
  fieldDefinitions: string[];
  onAddTypeField: () => void;
  onTypeNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTypeFieldChange: (op: 'change' | 'remove', index: number) => (e: ChangeEvent<HTMLInputElement>) => void;
}

const FormAddType = (props: Props) => {
  const { name, fieldDefinitions } = props;
  const fieldDefinitionsInput = fieldDefinitions.map((val, index) => (
    <Row key={index} style={{ marginBottom: "1rem", alignItems: "center" }}>
      <Column lg={10} md={7} sm={5}>
        <TextInput
          id={`form-add-type-field-${index}`}
          labelText=''
          value={val}
          onChange={props.onTypeFieldChange('change', index)}
        />
      </Column>
      <Column lg={2} md={1} sm={1}>
        <Button size="sm" kind="ghost" onClick={props.onTypeFieldChange('remove', index)}  renderIcon={Subtract20}  hasIconOnly iconDescription="remove" /> 
      </Column>
    </Row>
  ))
  return (
    <>
      <TextInput
        id="form-add-type-name"
        labelText='Custom type name'
        helperText="Shown in the select option and item detail."
        onChange={props.onTypeNameChange}
        value={name}
      />
      <hr style={{ marginTop: "1rem" }} />
      <p style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>Please add your custom fields below.</p>
      <Grid condensed>
        <Row style={{ marginBottom: "1rem" }}>
          <Column lg={10} md={10} sm={10}>
            <TextInput
              id="form-add-type-field-name"
              labelText="Default field"
              helperText="The field is default and used to display the name of the item in main page."
              defaultValue="Name"
              disabled
            />
          </Column>
        </Row>
        {fieldDefinitionsInput}
        <Row>
          <Column>
            <Button kind="ghost" onClick={props.onAddTypeField}> Add New Field </Button>
          </Column>
        </Row>
      </Grid>
    </>
  )
}

export default FormAddType;
