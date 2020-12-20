import React, { ChangeEvent } from 'react';
import axios from 'axios';
import {
  ClickableTile,
  Modal,
  InlineNotification,
  FormLabel,
  Column,
  ContentSwitcher,
  ModalBody,
  ModalHeader,
  ModalProps,
  Switch,
} from 'carbon-components-react';

import FormEditItem from './FormEditItem';
import FormViewItem from './FormViewItem';
import { Item } from '../model';
import { capitalize, getPK } from '../core/util';
import { CryptObject } from '../core/crypt';
import { EditItemRequest } from '../core/api';
import { getAPIRoute } from '../core/routemap';

type Props = {
  item: Item;
  onConfirm: () => Promise<void>;
}

type Mode = 'edit' | 'view' | 'delete' | 'confirm';

type State = {
  open: boolean;
  mode: Mode;
  prevMode: Mode;
  fields: {[key: string] : string};
  warn: boolean;
  warnText: string;
  loading: boolean;
}

export default class ModalItemClickable extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      mode: 'view',
      prevMode: 'view',
      fields: {},
      warn: false,
      warnText: '',
      loading: false,
    };

    for(let val of this.props.item.values) {
      this.state.fields[val.fieldDefinition.name] = val.value;
    }
  }

  public getItemTypeName(item: Item) : string {
    for (let value of item.values) {
      if (value.fieldDefinition.name === 'name') {
        return value.value;
      }
    }
    return 'error'
  }

  public getFieldDefinitionVerboseName(name: string) : string {
    for (let val of this.props.item.values) {
      if (val.fieldDefinition.name === name) return val.fieldDefinition.verboseName;
    }
    return '';
  }

  public onFieldValueChange = (name: string) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      this.setState({
        fields: {
          ...this.state.fields,
          [name]: e.currentTarget.value,
        },
      });
    };
  }

  public init = () => {
    const fields: { [key: string] : string } = {};
    for(let val of this.props.item.values) {
      fields[val.fieldDefinition.name] = val.value;
    }

    this.setState({
      mode: 'view',
      prevMode: 'view',
      fields,
      warn: false,
    });
  }

  public openModal = () => {
    this.setState({open: true });
  }

  public closeModal = () => {
    this.init();
    this.setState({
      open: false,
    });
  }

  public onEditButtonClick = () => {
    this.setState({
      prevMode: this.state.mode,
      mode: 'edit',
    });
  }

  public onDeleteButtonClick = () => {
    this.setState({
      prevMode: this.state.mode,
      mode: 'confirm',
    });
  }

  public onSaveButtonClick = () => {
    // check whether there are empty fields.
    for (let key in this.state.fields) {
      if (!this.state.fields[key]) {
        this.setState({
          warn: true,
          warnText: `${capitalize(this.getFieldDefinitionVerboseName(key))} is empty.`
        });
        return;
      }
    }

    this.setState({
      warn: false,
      prevMode: this.state.mode,
      mode: 'confirm'
    });
  }
 
  public onBackButtonClick = () => {
    this.setState({
      prevMode: this.state.mode,
      warn: false,
      mode: this.state.mode === 'edit' ? 'view' : this.state.prevMode,
    });

    if (this.state.mode === 'edit') {
      const fields: { [key: string]: string } = {};
      for(let val of this.props.item.values) {
        fields[val.fieldDefinition.name] = val.value;
      }
      this.setState({
        fields,
      });
    }
  }

  public onConfirmButtonClick = async () => {
    if (this.state.prevMode === 'edit') {
      const pk = getPK();
      const fields: {[key: string]: string} = {};
      for (let key in this.state.fields) {
        fields[key] = CryptObject.encrypt(this.state.fields[key], pk).cipherParams;
      }

      const body: EditItemRequest = {
        fields,
      };
      this.setState({
        loading: true,
      });
      try {
        await axios.put(`${getAPIRoute('item')}${this.props.item.ID}`, body);
        await this.props.onConfirm();
        this.init();
      } catch (err) {
        this.setState({
          loading: false,
          warn: true,
          warnText: 'Server error. Please retry later.'
        });
      }
      return
    }

    if (this.state.prevMode === 'view') {
      try {
        await axios.delete(`${getAPIRoute('item')}${this.props.item.ID}`);
        await this.props.onConfirm();
        this.init();
      } catch (error) {
        this.setState({
          loading: false,
          warn: true,
          warnText: 'Server error. Please retry later.'
        });
      }
    }
  }

  public onCloseNotification = () => {
    this.setState({
      warn: false,
    })
  }

  public getModalProps = () : ModalProps => {
    switch(this.state.mode) {
      case 'view':
        return {
          primaryButtonText: 'Close',
          secondaryButtonText: 'Delete',
          onRequestSubmit: this.closeModal,
          onSecondarySubmit: this.onDeleteButtonClick,
        }

      case 'edit':
        return {
          primaryButtonText: 'Save',
          secondaryButtonText: 'Cancel',
          onRequestSubmit: this.onSaveButtonClick,
          onSecondarySubmit: this.onBackButtonClick,
        }

      case 'confirm':
        return {
          primaryButtonText: 'Confirm',
          secondaryButtonText: 'Back',
          onRequestSubmit: this.onConfirmButtonClick,
          onSecondarySubmit: this.onBackButtonClick,
        }

      default:
        return{};
    }
  }

  public render() {
    return (
      <>
        <Column sm={6} md={3} lg={3} style={{ marginBottom: '1rem' }}>
          <ClickableTile handleClick={this.openModal} style={{ borderRadius: "0.2rem", paddingBottom: "1.5rem" }}>
            <FormLabel>{capitalize(this.props.item.type.verboseName)}</FormLabel>
              <div style={{ display: 'flex', justifyContent: 'center', lineBreak: "strict" }}>{this.getItemTypeName(this.props.item)}</div>
          </ClickableTile>
          <Modal
            open={this.state.open}
            hasForm
            onRequestClose={this.closeModal}
            preventCloseOnClickOutside
            {...this.getModalProps()}
          >
            <ModalHeader closeModal={this.closeModal} label={capitalize(this.props.item.type.verboseName)} />
            <ModalBody>
              {
                this.state.mode !== 'confirm' && (
                <ContentSwitcher style={{ marginBottom: "1rem" }} selectedIndex={this.state.mode === 'view' ? 0 : 1}>
                  <Switch text="View" onClick={this.onBackButtonClick} onKeyDown={this.onBackButtonClick} />
                  <Switch text="Edit" onClick={this.onEditButtonClick} onKeyDown={this.onEditButtonClick} />
                </ContentSwitcher>
                )
              }
              {
                this.state.mode === 'view' && <FormViewItem item={this.props.item} />
              }
              {
                this.state.mode === 'edit' && <FormEditItem item={this.props.item} fields={this.state.fields} onFieldChange={this.onFieldValueChange} />
              }
              {
                this.state.mode === 'confirm' && <h2>
                  { this.state.prevMode === 'edit' ? `Please click Confirm button to save your changes.` : `Please click Confirm button to delete the item.` }
                </h2>
              }
            </ModalBody>
            {
              this.state.warn && <InlineNotification kind='error' title={this.state.warnText} onCloseButtonClick={this.onCloseNotification} />
            }
          </Modal>
        </Column>
      </>
    )
  }
}