import React from 'react';
import { Item } from '../model';

type Props = {
  item: Item;
}

export default class FormEditItem extends React.PureComponent<Props> {
  public render() {
    return (
      <p>{this.props.item.ID}</p>
    )
  }
}