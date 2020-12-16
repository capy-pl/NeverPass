import React from 'react';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { Modal, Content } from 'carbon-components-react';
import { ClientRouteMap } from '../../core/routemap';

type State = {};

class SignIn extends React.PureComponent<WithRouterProps, State> {
  public state: State = {};

  public componentDidMount() {
    const modalCloseButton = document.getElementsByClassName('bx--modal-close');
    if (modalCloseButton.length) {
      (modalCloseButton[0] as HTMLButtonElement).style.display = 'none';
    }
  }

  public onClickPrimaryButton = () => {
    this.props.router.push(ClientRouteMap['signin']);
  };

  public render() {
    return (
      <Modal
        open
        size="sm"
        hasForm
        modalHeading="Sign in With Your LastPass Account"
        primaryButtonText="Sign in"
        onRequestSubmit={this.onClickPrimaryButton}
      >
        <Content>
          Your account has been successfully created. Please go back to sign in
          page.
        </Content>
      </Modal>
    );
  }
}

export default withRouter(SignIn);
