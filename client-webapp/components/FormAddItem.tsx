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
import { AddItemRequest } from '../core/api';
import { capitalize } from '../core/util';
import { getAPIRoute } from '../core/routemap';
import store from '../store';
import { CryptObject } from '../core/crypt';

type Props = {
  open: boolean;
  closeModal: () => void;
  types: Type[];
  onSave: () => void;
};

type State = {
  type: string;
  typeid: number;
  fields: { [key: string]: string };
  loading: boolean;
  warn: boolean;
  warnText: string;
};

export default class FormAddItem extends React.PureComponent<Props, State> {
  public state: State = {
    type: 'placeholder',
    typeid: -1,
    fields: {},
    loading: false,
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

  public getForm() {
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
    const types = this.props.types.filter<Type>(
      (val): val is Type => val.name === e.currentTarget.value
    );

    const currentType = types[0];
    const fields: { [key: string]: string } = {};
    for (let key of currentType.fieldDefinitions) {
      fields[key.name] = '';
    }

    this.setState({
      type: e.currentTarget.value,
      typeid: currentType.ID,
      fields,
    });
  };

  public clear = () => {
    this.setState({
      type: 'placeholder',
      fields: {},
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

  public onSave = async () => {
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
      this.props.onSave();
      this.onCloseModal();
    } catch (error) {
      this.setState({
        warn: true,
        warnText: 'server error',
        loading: false,
      });
    }
  };

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
        hasForm
      >
        <ModalHeader title="Add New Item" closeModal={this.onCloseModal} />
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
            defaultValue="placeholder"
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
              <SelectItem disabled value="custom" text="Add custom types" />
            </SelectItemGroup>
          </Select>
          <br />
          {this.getForm()}
        </ModalBody>
      </Modal>
    );
  }
}
