import React from 'react';

import {
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderSideNavItems,
  SkipToContent,
  SideNav,
  SideNavItems,
  Loading,
} from 'carbon-components-react';

interface Props {
  loading?: boolean;
}

interface State {
  sideNavExpanded: boolean;
}

export default class UIShell extends React.Component<Props, State> {
  state: State = {
    sideNavExpanded: false,
  };

  public onClickNavExpand = () => {
    this.setState({
      sideNavExpanded: !this.state.sideNavExpanded,
    });
  };

  public render() {
    return (
      <>
        <Loading
          style={{ zIndex: 10000 }}
          withOverlay
          active={!!this.props.loading}
        />
        <Header aria-label="NeverPass" style={{ zIndex: 5000 }}>
          <SkipToContent />
          <HeaderMenuButton
            aria-label="Open menu"
            onClick={this.onClickNavExpand}
            isActive={this.state.sideNavExpanded}
          />
          <HeaderName href="#" prefix="">
            NeverPass
          </HeaderName>
          <HeaderNavigation aria-label="Header navigation">
            {/* <HeaderMenuItem isCurrentPage href="#">
              All
            </HeaderMenuItem>
            <HeaderMenuItem href="#">Passwords</HeaderMenuItem>
            <HeaderMenuItem href="#">Payment Cards</HeaderMenuItem>
            <HeaderMenuItem href="#">Bank Accounts</HeaderMenuItem> */}
          </HeaderNavigation>
          <SideNav
            aria-label="Side navigation"
            expanded={this.state.sideNavExpanded}
            isPersistent={false}
            isRail
          >
            <SideNavItems>
              <HeaderSideNavItems>
                {/* <HeaderMenuItem href="#">All</HeaderMenuItem>
                <HeaderMenuItem href="#">Passwords</HeaderMenuItem>
                <HeaderMenuItem href="#">Payment Cards</HeaderMenuItem>
                <HeaderMenuItem href="#">Bank Accounts</HeaderMenuItem> */}
              </HeaderSideNavItems>
            </SideNavItems>
          </SideNav>
        </Header>
        {this.props.children}
      </>
    );
  }
}
