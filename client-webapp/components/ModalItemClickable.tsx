import React from 'react';
import {
  ClickableTile,
  Modal,
  Tooltip,
  FormLabel,
  Content,
  Column,
  ModalBody,
  ModalHeader
} from 'carbon-components-react';

import FormEditItem from './FormEditItem';
import FormViewItem from './FormViewItem';
import { Item, ItemField, Type } from '../model';
import { capitalize } from '../core/util';

type Props = {
  item: Item;
}

type State = {
  open: boolean;
  editMode: boolean;
}

export default class ModalItemClickable extends React.PureComponent<Props, State> {
  public state: State = {
    open: false,
    editMode: false,
  };

  public getItemTypeName(item: Item) : string {
    for (let value of item.values) {
      if (value.fieldDefinition.name === 'name') {
        return value.value;
      }
    }
    return 'error'
  }

  public toggleModal = () => {
    this.setState({ open: !this.state.open });
  }

  public render() {
    return (
      <>
        <Column sm={6} md={3} lg={3} style={{ marginBottom: '1rem' }}>
          <ClickableTile handleClick={this.toggleModal} style={{ borderRadius: "0.2rem", paddingBottom: "1.5rem" }}>
            <FormLabel>{capitalize(this.props.item.type.verboseName)}</FormLabel>
              <div style={{ display: 'flex', justifyContent: 'center', lineBreak: "strict" }}>{this.getItemTypeName(this.props.item)}</div>
          </ClickableTile>
          <Modal open={this.state.open} hasForm onRequestClose={this.toggleModal} preventCloseOnClickOutside>
            <ModalHeader>1234</ModalHeader>
            <ModalBody>{1234}</ModalBody>
          </Modal>
        </Column>
      </>
    )
  }
}