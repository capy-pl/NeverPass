import React, { ChangeEvent } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Select,
  SelectItem,
  SelectItemGroup,
  TextInput,
  InlineNotification,
} from 'carbon-components-react';
import axios from 'axios';

import { Type } from '../model';
import { AddItemRequest, AddTypeRequest } from '../core/api';
import { capitalize } from '../core/util';
import { getAPIRoute } from '../core/routemap';
import store from '../store';
import { CryptObject } from '../core/crypt';
import FormAddType from './FormAddType';

type Props = {
  open: boolean;
  closeModal: () => void;
  types: Type[];
  onSaveItem: () => Promise<void>;
  onSaveType: () => Promise<void>;
};

type State = {
  mode?: 'item' | 'type';
  type: string;
  typeid: number;
  fields: { [key: string]: string };
  loading: boolean;
  newTypeName: string;
  newTypeFields: string[];
  warn: boolean;
  warnText: string;
};

export default class ModalAddClickable extends React.PureComponent<Props, State> {
  public state: State = {
    type: 'placeholder',
    typeid: -1,
    fields: {},
    loading: false,
    newTypeName: '',
    newTypeFields: [],
    warn: false,
    warnText: '',
  };

  public getSelectItemsOptions() {
    return this.props.types.map((type) => {
      return (
        <SelectItem
          key={type.ID}
          text={capitalize(type.verboseName)}
          value={type.name}
        />
      );
    });
  }

  public onValueChange = (name: string) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      this.setState({
        fields: {
          ...this.state.fields,
          [name]: e.currentTarget.value,
        },
      });
    };
  };

  public onTypeSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.currentTarget.value === 'custom') {
      this.clear();
      this.setState({
        mode: 'type',
        type: e.currentTarget.value,
      });

      return;
    }

    const types = this.props.types.filter<Type>(
      (val): val is Type => val.name === e.currentTarget.value
    );

    const currentType = types[0];
    const fields: { [key: string]: string } = {};
    for (let key of currentType.fieldDefinitions) {
      fields[key.name] = '';
    }
  
    this.clear();
    this.setState({
      mode: 'item',
      type: e.currentTarget.value,
      typeid: currentType.ID,
      fields,
    });
  };

  public clear = () => {
    this.setState({
      mode: undefined,
      type: 'placeholder',
      fields: {},
      newTypeName: '',
      newTypeFields: [],  
      warn: false,
      loading: false,
      warnText: '',
    });
  };

  public onCloseModal = () => {
    this.clear();
    this.props.closeModal();
  };

  public closeNotification = () => {
    this.setState({
      warn: false,
    });
  };

  public saveItem = async () => {
    for (let val in this.state.fields) {
      if (!this.state.fields[val].length) {
        this.setState({
          warn: true,
          warnText: `${val} is requred.`,
        });
        return;
      }
    }

    const fields: { [key: string]: string } = {};
    const pk = store.getState().user.pk;

    // encrypt item field value with user's pk
    for (let key in this.state.fields) {
      fields[key] = CryptObject.encrypt(
        this.state.fields[key],
        pk
      ).cipherParams;
    }

    const body: AddItemRequest = {
      typeid: this.state.typeid,
      fields,
    };

    this.setState({
      loading: true,
    });

    try {
      await axios.post(getAPIRoute('item'), body);
      await this.props.onSaveItem();
      this.onCloseModal();
    } catch (error) {
      this.setState({
        warn: true,
        warnText: 'server error',
        loading: false,
      });
    }
  }

  public onNewTypeNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newTypeName: e.currentTarget.value,
    });
  }

  public onNewTypeAddNewField = () => {
    // append a new field when there are currently no field or the last field is not an empty string.
    if (this.state.newTypeFields.length === 0 || this.state.newTypeFields[this.state.newTypeFields.length - 1].length) {
      this.setState({
        newTypeFields: [...this.state.newTypeFields, ''],
      });
    }
  }

  public onNewTypeFieldChange = (op: 'change' | 'remove', index: number) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      if (op === 'change') {
        const copy = this.state.newTypeFields.slice();
        copy[index] = e.currentTarget.value;
        this.setState({
          newTypeFields: copy,
        });
      }

      if (op === 'remove') {
        const copy = this.state.newTypeFields.slice()
        copy.splice(index, 1);
        this.setState({
          newTypeFields: copy,
        });
      }
    }
  }

  public saveType = async () => {
    if (!this.state.newTypeName) {
      this.setState({
        warn: true,
        warnText: "Name is required."
      });
      return;
    }
    for (let val of this.state.newTypeFields) {
      if (!val.length) {
        this.setState({
          warn: true,
          warnText: "There is an empty field. Please remove or fill it."
        });
        return;
      }
    }

    const body: AddTypeRequest = {
      name: this.state.newTypeName,
      fieldDefinitions: this.state.newTypeFields,
    };

    this.setState({
      loading: true,
    });

    try {
      await axios.post(getAPIRoute("type"), body);
      await this.props.onSaveType();
      this.clear();
    } catch (err) {
      this.setState({
        warn: true,
        warnText: 'server error'
      });
    }
  }

  public onSave = () => {
    if (this.state.mode && this.state.mode === 'item') {
      this.saveItem();
    } else {
      this.saveType();
    }
  };

  public getItemForm() {
    if (!this.state.type) {
      return <></>;
    }

    const types = this.props.types.filter<Type>(
      (val): val is Type => val.name === this.state.type
    );

    if (!types.length) {
      return <></>;
    }

    const currentType = types[0];
    return currentType.fieldDefinitions.map((fieldDefinition) => (
      <TextInput
        key={fieldDefinition.ID}
        id={fieldDefinition.name}
        style={{ marginBottom: '1rem' }}
        labelText={capitalize(fieldDefinition.verboseName)}
        onChange={this.onValueChange(fieldDefinition.name)}
        value={this.state.fields[fieldDefinition.name] || ''}
        warnText="The field is required."
        disabled={this.state.loading}
      />
    ));
  }

  public render() {
    return (
      <Modal
        open={this.props.open}
        onRequestClose={this.onCloseModal}
        onRequestSubmit={this.onSave}
        onSecondarySubmit={this.clear}
        primaryButtonText="Save"
        secondaryButtonText="Clear"
        preventCloseOnClickOutside
        primaryButtonDisabled={this.state.loading}
        size="lg"
        hasForm
      >
        <ModalHeader title={this.state.mode === 'item' ? "Add New Item" : "Add Custom Type"} closeModal={this.onCloseModal} />
        <ModalBody>
          {this.state.warn && (
            <InlineNotification
              title="warning"
              kind="error"
              subtitle={this.state.warnText}
              onCloseButtonClick={this.closeNotification}
            />
          )}
          <Select
            id="type"
            size="xl"
            labelText=""
            onChange={this.onTypeSelectChange}
            value={this.state.type}
            disabled={this.state.loading}
          >
            <SelectItem
              disabled
              hidden
              value="placeholder"
              text="Choose item's type"
            />
            <SelectItemGroup label="Types">
              {this.getSelectItemsOptions()}
            </SelectItemGroup>
            <SelectItemGroup label="Custom types">
              <SelectItem value="custom" text="Add custom types" />
            </SelectItemGroup>
          </Select>
          <br />
          {
            this.state.mode === 'item' && this.getItemForm()
          }
          {
            this.state.mode === 'type' && <FormAddType
            name={this.state.newTypeName}
            fieldDefinitions={this.state.newTypeFields}
            onAddTypeField={this.onNewTypeAddNewField}
            onTypeNameChange={this.onNewTypeNameChange}
            onTypeFieldChange={this.onNewTypeFieldChange}
          />
          }
        </ModalBody>
      </Modal>
    );
  }
}
