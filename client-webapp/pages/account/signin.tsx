import React, { ChangeEvent } from 'react';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { FluidForm, TextInput, Modal, Loading } from 'carbon-components-react';
import axios from 'axios';

import {
  UserSignInRequest,
  UserSignInResponse,
  UserInfoResponse,
} from '../../core/api';
import { validateEmail } from '../../core/util';
import { ClientRouteMap, getAPIRoute } from '../../core/routemap';
import { sha256, CryptObject } from '../../core/crypt';
import store from '../../store';

type State = {
  account: string;
  error: boolean;
  errMessage: string;
  password: string;
  loading: boolean;
  showAccountWarning: boolean;
  showPasswordWarning: boolean;
  primaryButtonDisabled: boolean;
};

class SignIn extends React.PureComponent<WithRouterProps, State> {
  public state: State = {
    account: '',
    error: false,
    errMessage: '',
    password: '',
    loading: false,
    showAccountWarning: false,
    showPasswordWarning: false,
    primaryButtonDisabled: true,
  };

  public accountFieldRef = React.createRef<HTMLInputElement>();
  public passwordFieldRef = React.createRef<HTMLInputElement>();
  public interval?: number;

  public componentDidMount() {
    const modalCloseButton = document.getElementsByClassName('bx--modal-close');
    if (modalCloseButton.length) {
      (modalCloseButton[0] as HTMLButtonElement).style.display = 'none';
    }
    this.onBrowserAutoFill();
  }

  public componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  // some browsers will auto fill the text input, which doesnt trigger change event.
  // this causes an inconsistent state between component state and HTML input element's state
  // need to listen on the change of the value on the html input and update react component state
  // accordingly.
  public onBrowserAutoFill = () => {
    this.interval = window.setInterval(() => {
      if (this.accountFieldRef.current) {
        this.setState({
          account: this.accountFieldRef.current.value && this.state.account,
        });
      }

      if (this.passwordFieldRef.current) {
        this.setState({
          password: this.passwordFieldRef.current.value && this.state.password,
        });
      }
    }, 250);
  };

  public onChangeAccountInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e) {
      e.preventDefault();
      const showAccountWarning = !validateEmail(e.currentTarget.value);
      this.setState({
        account: e.currentTarget.value,
        error: false,
        showAccountWarning,
        primaryButtonDisabled:
          this.state.showPasswordWarning || showAccountWarning,
      });
    }
  };

  public onChangePasswordInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const showPasswordWarning = !(e.currentTarget.value.length > 0);
    this.setState({
      password: e.currentTarget.value,
      error: false,
      showPasswordWarning,
      primaryButtonDisabled:
        this.state.showAccountWarning || showPasswordWarning,
    });
  };

  public onClickPrimaryButton = async () => {
    const password = sha256(this.state.password);
    const body: UserSignInRequest = {
      account: this.state.account,
      password,
    };

    this.setState({
      loading: true,
    });

    try {
      const response = await axios.post<UserSignInResponse>(
        getAPIRoute('signin'),
        body
      );

      axios.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;

      store.dispatch({
        type: 'set',
        key: 'token',
        value: response.data.token,
      });

      const infoResponse = await axios.get<UserInfoResponse>(
        getAPIRoute('userinfo')
      );

      store.dispatch({
        type: 'set',
        key: 'id',
        value: infoResponse.data.id,
      });

      const encryptedPk = new CryptObject(infoResponse.data.pk);
      const pk = encryptedPk.decrypt(this.state.password);

      store.dispatch({
        type: 'set',
        key: 'pk',
        value: pk,
      });

      this.props.router.push(ClientRouteMap['root']);
    } catch (err) {
      this.setState({
        error: true,
        loading: false,
      });
    }
  };

  public onClickSecondaryButton = () => {
    this.props.router.push(ClientRouteMap['signup']);
  };

  public render() {
    return (
      <Modal
        open
        size="sm"
        hasForm
        modalHeading="Sign in With Your LastPass Account"
        primaryButtonText="Sign In"
        secondaryButtonText="Create New Account"
        primaryButtonDisabled={this.state.loading}
        onRequestSubmit={this.onClickPrimaryButton}
        onSecondarySubmit={this.onClickSecondaryButton}
      >
        <Loading withOverlay active={this.state.loading} />
        <FluidForm>
          <TextInput
            id="account"
            ref={this.accountFieldRef}
            labelText="Email Address"
            type="text"
            disabled={this.state.loading}
            onChange={this.onChangeAccountInput}
            value={this.state.account}
            warnText="Please enter an valid email address."
            warn={this.state.showAccountWarning}
          ></TextInput>
          <TextInput
            id="password"
            labelText="Password"
            type="password"
            ref={this.passwordFieldRef}
            disabled={this.state.loading}
            value={this.state.password}
            onChange={this.onChangePasswordInput}
            warnText="Please enter a valid password."
            warn={this.state.showPasswordWarning}
          ></TextInput>
        </FluidForm>
        {this.state.error && (
          <p className="error-message">Invalid email or password</p>
        )}
      </Modal>
    );
  }
}

export default withRouter(SignIn);
