import React from 'react';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import axios from 'axios';
import {
  Button,
  Content,
  Grid,
  Row,
  ToastNotification,
} from 'carbon-components-react';
import { Add16 } from '@carbon/icons-react';

import UIShell from '../layout/UIShell';
import { ModalAddClickable, ModalItemClickable } from '../components';
import { ClientRouteMap, getAPIRoute } from '../core/routemap';
import store from '../store';
import { GetTypesResponse, GetItemsResponse } from '../core/api';
import { Item, Type } from '../model';
import { CryptObject } from '../core/crypt';
import { getPK } from '../core/util';

type State = {
  loading: boolean;
  error: boolean;
  items: Item[];
  types: Type[];
  showModalAddClickable: boolean;
};

class IndexPage extends React.Component<WithRouterProps, State> {
  public state: State = {
    loading: true,
    error: false,
    showModalAddClickable: false,
    items: [],
    types: [],
  };

  public componentDidMount() {
    const state = store.getState();
    if (!state.auth.token) {
      this.props.router.push(ClientRouteMap['signin']);
      return;
    } else {
      axios.defaults.headers['Authorization'] = `Bearer ${state.auth.token}`;
    }
    this.init();
  }

  public fetchTypes = async () => {
    const response = await axios.get<GetTypesResponse>(getAPIRoute('type'));
    this.setState({
      types: response.data,
    });
  };

  public fetchItems = async () => {
    const response = await axios.get<GetItemsResponse>(getAPIRoute('item'));
    const pk = getPK();
    for (let item of response.data) {
      for (let value of item.values) {
        value.value = new CryptObject(value.value).decrypt(pk);
      }
    }

    this.setState({
      items: response.data,
    });
  };

  public init = async () => {
    this.setState({
      loading: true,
    });
    try {
      await Promise.all([this.fetchTypes(), this.fetchItems()]);
      this.setState({
        loading: false,
      });
    } catch (err) {
      this.setState({
        loading: false,
        error: true,
      });
    }
  };

  public toggleModalAddClickable = () => {
    this.setState({
      showModalAddClickable: !this.state.showModalAddClickable,
    });
  };

  public onModalAddClickableItemSave = async () => {
    this.setState({
      loading: true,
    });
    await this.fetchItems();
    this.setState({
      loading: false,
    });
  };

  public onModalAddClickableTypeSave = async () => {
    this.setState({
      loading: true,
    });
    await this.fetchTypes();
    this.setState({
      loading: false,
    });
  }

  public renderItems = () => {
    return this.state.items.map((item) => <ModalItemClickable onConfirm={this.fetchItems}  key={item.ID} item={item} />);
  }

  render() {
    return (
      <UIShell loading={this.state.loading}>
        <Content>
          {/* <Search labelText="search" title="Search Your Vault" /> */}
          <h3 style={{ marginTop: "1rem" }}>All Items</h3>
          <hr />
          {this.state.error ? (
            <ToastNotification
              style={{ width: '100%' }}
              title="Error"
              subtitle="There is a connection error with server.
          Please retry later.
          "
              caption={''}
            ></ToastNotification>
          ) : (
            <></>
          )}
          <Grid style={{ marginTop: "1rem" }}>
            <Row>
              { this.renderItems() }
            </Row>
          </Grid>
        </Content>
        <ModalAddClickable
          types={this.state.types}
          open={this.state.showModalAddClickable}
          closeModal={this.toggleModalAddClickable}
          onSaveItem={this.onModalAddClickableItemSave}
          onSaveType={this.onModalAddClickableTypeSave}
        />
        <Button
          style={{ position: 'fixed', right: '2rem', bottom: '2rem' }}
          renderIcon={Add16}
          onClick={this.toggleModalAddClickable}
          iconDescription="Add a New Item"
          hasIconOnly
        />
      </UIShell>
    );
  }
}

export default withRouter(IndexPage);
