import React from 'react';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import axios from 'axios';
import {
  Button,
  Content,
  Search,
  ToastNotification,
} from 'carbon-components-react';
import { Add16 } from '@carbon/icons-react';

import UIShell from '../layout/UIShell';
import { FormAddItem } from '../components';
import { ClientRouteMap, getAPIRoute } from '../core/routemap';
import store from '../store';
import { GetTypesResponse, GetItemsResponse } from '../core/api';
import { Item, Type } from '../model';

type State = {
  loading: boolean;
  error: boolean;
  items: Item[];
  types: Type[];
  showFormAddItem: boolean;
};

class IndexPage extends React.Component<WithRouterProps, State> {
  public state = {
    loading: true,
    error: false,
    showFormAddItem: false,
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

  public toggleFormAddItem = () => {
    this.setState({
      showFormAddItem: !this.state.showFormAddItem,
    });
  };

  public onFormAddItemSave = async () => {
    this.setState({
      loading: true,
    });
    await this.fetchItems();
    this.setState({
      loading: false,
    });
  };

  render() {
    return (
      <UIShell loading={this.state.loading}>
        <Content>
          <Search labelText="search" title="Search Your Vault" />
          <br />
          <h3>All Items</h3>
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
        </Content>
        <FormAddItem
          types={this.state.types}
          open={this.state.showFormAddItem}
          closeModal={this.toggleFormAddItem}
          onSave={this.onFormAddItemSave}
        />
        <Button
          style={{ position: 'fixed', right: '2rem', bottom: '2rem' }}
          renderIcon={Add16}
          onClick={this.toggleFormAddItem}
          iconDescription="Add a New Item"
          hasIconOnly
        />
      </UIShell>
    );
  }
}

export default withRouter(IndexPage);
