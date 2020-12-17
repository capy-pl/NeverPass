import React, { ChangeEvent } from 'react';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { FluidForm, TextInput, Modal, Loading } from 'carbon-components-react';
import axios from 'axios';

import { UserCreateRequest, UserCreateResponse } from '../../core/api';
import { validateEmail } from '../../core/util';
import { ClientRouteMap, getAPIRoute } from '../../core/routemap';
import { generateSecretKey, CryptObject, sha256 } from '../../core/crypt';
import store from '../../store';

type State = {
  account: string;
  error: boolean;
  password: string;
  checkedPassword: string;
  loading: boolean;
  showAccountWarning: boolean;
  showPasswordWarning: boolean;
  showCheckPasswordWarning: boolean;
  primaryButtonDisabled: boolean;
};

class SignUp extends React.PureComponent<WithRouterProps, State> {
  public state: State = {
    account: '',
    error: false,
    password: '',
    checkedPassword: '',
    loading: false,
    showAccountWarning: false,
    showPasswordWarning: false,
    showCheckPasswordWarning: false,
    primaryButtonDisabled: true,
  };

  public componentDidMount() {
    const modalCloseButton = document.getElementsByClassName('bx--modal-close');
    if (modalCloseButton.length) {
      (modalCloseButton[0] as HTMLButtonElement).style.display = 'none';
    }
  }

  public onChangeAccountInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e) {
      e.preventDefault();
      const showAccountWarning = !validateEmail(e.currentTarget.value);
      this.setState({
        account: e.currentTarget.value,
        error: false,
        showAccountWarning,
        primaryButtonDisabled:
          this.state.showPasswordWarning ||
          showAccountWarning ||
          this.state.showCheckPasswordWarning,
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
        this.state.showAccountWarning ||
        this.state.showCheckPasswordWarning ||
        showPasswordWarning,
    });
  };

  public onChangeCheckPasswordInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const showCheckPasswordWarning = !(
      e.currentTarget.value === this.state.password
    );
    this.setState({
      checkedPassword: e.currentTarget.value,
      error: false,
      showCheckPasswordWarning,
      primaryButtonDisabled:
        this.state.showAccountWarning ||
        this.state.showPasswordWarning ||
        showCheckPasswordWarning,
    });
  };

  public onClickPrimaryButton = async () => {
    const account = this.state.account;
    const password = sha256(this.state.password); // use sha256 to obfuscate original password

    // generate an universal key for user, then use user's password as private key to encrypt
    // the universal key with AES
    // note that the encrypt key is the user's password without sha 256
    const pk = CryptObject.encrypt(generateSecretKey(), this.state.password)
      .cipherParams;

    const body: UserCreateRequest = {
      account,
      password,
      pk,
    };

    this.setState({
      loading: true,
    });

    try {
      await axios.post<UserCreateResponse>(
        getAPIRoute('signup'),
        body
      );

      this.props.router.push(ClientRouteMap['message']);
    } catch (err) {
      this.setState({
        error: true,
        loading: false,
      });
    }
  };

  public onClickSecondaryButton = () => {
    this.props.router.push(ClientRouteMap['signin']);
  };

  public render() {
    return (
      <Modal
        open
        size="sm"
        hasForm
        modalHeading="Sign Up A New LastPass Account"
        primaryButtonText="Sign Up"
        secondaryButtonText="Back"
        primaryButtonDisabled={this.state.primaryButtonDisabled}
        onRequestSubmit={this.onClickPrimaryButton}
        onSecondarySubmit={this.onClickSecondaryButton}
      >
        <Loading withOverlay active={this.state.loading} />
        <FluidForm>
          <TextInput
            id="account"
            labelText="Email Address"
            type="text"
            onChange={this.onChangeAccountInput}
            disabled={this.state.loading}
            value={this.state.account}
            warnText="Please enter an valid email address."
            warn={this.state.showAccountWarning}
          ></TextInput>
          <TextInput
            id="password"
            labelText="Password"
            type="password"
            value={this.state.password}
            disabled={this.state.loading}
            onChange={this.onChangePasswordInput}
            warnText="Please enter a valid password."
            warn={this.state.showPasswordWarning}
          ></TextInput>
          <TextInput
            id="check-password"
            labelText="Check your password again"
            type="password"
            disabled={this.state.loading}
            value={this.state.checkedPassword}
            onChange={this.onChangeCheckPasswordInput}
            warnText="Passwords do not match."
            warn={this.state.showCheckPasswordWarning}
          ></TextInput>
        </FluidForm>
        {this.state.error && (
          <p className="error-message">Invalid email or password</p>
        )}
      </Modal>
    );
  }
}

export default withRouter(SignUp);
