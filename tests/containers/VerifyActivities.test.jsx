import React from 'react';
import { mount, shallow } from 'enzyme';
import { spy } from 'sinon';
import { createMockStore } from 'redux-test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import VerifyActivities from '../../src/containers/VerifyActivities';
import storeFixture from '../../src/fixtures/store';
import society from '../../src/fixtures/society';
import activity from '../../src/fixtures/activity';

const store = createMockStore(storeFixture);
const history = { push: () => { }, location: { pathname: '' } };
const roles = ['success ops'];
const verifyActivitiesOpsSpy = spy();
const verifyActivitySpy = spy();
const event = { preventDefault: () => { } };

describe('<VerifyActivities />', () => {
  const props = {
    history,
    fetchUserInfo: () => { },
    changePageTitle: () => { },
    fetchSocietyInfo: () => { },
    societyActivities: society.loggedActivities,
    requesting: false,
    verifyActivitiesOps: verifyActivitiesOpsSpy,
    verifyActivity: verifyActivitySpy,
  };

  const component = shallow(<VerifyActivities.WrappedComponent
    {...props}
  />);
  it('should render without crashing', () => {
    const wrapperProps = { ...props, userRoles: roles };
    const wrapper = mount.bind(
      null,
      <Provider store={store}>
        <MemoryRouter>
          <VerifyActivities.WrappedComponent {...wrapperProps} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper).not.toThrow();
  });

  it('should change state of isSelectAllChecked when you call handleSelectAllClick', () => {
    component.setState({ isSelectAllChecked: true });
    component.instance().handleSelectAllClick();
    expect(component.state().isSelectAllChecked).toBe(false);
  });

  it('should update state after deselecting an item using handleDeselectActivity', () => {
    const deselectedId = 'bnfad176-43cd-11e8-b3b9-9801a7ae0329';
    // select all activities in review
    component.instance().handleSelectAllClick();
    const { selectedActivities } = component.state();
    // deselect one activity
    component.instance().handleDeselectActivity(deselectedId);
    const selected = selectedActivities.filter(item => item.id !== deselectedId);
    expect(selectedActivities).toEqual(selected);
  });

  it('should call verifyActivitiesOps props when handleApproveAllClick is invoked', () => {
    const instance = component.instance();
    instance.handleApproveAllClick();
    expect(verifyActivitiesOpsSpy.called).toBeTruthy();
  });

  it('should have the <MasonryLayout /> layout when role is not successOps', () => {
    expect(component.find('MasonryLayout').length).toBe(1);
  });

  it('should have the <LinearLayout /> layout when role is successOps', () => {
    component.setProps({ userRoles: ['success ops'] });
    expect(component.find('LinearLayout').length).toBe(1);
  });

  it('should show loader when fetching', () => {
    component.setProps({ requesting: true });
    expect(component.find('Loader').length).toBe(1);
  });

  it('should change state of selectedSociety when handleChangeTab is called with a title', () => {
    component.instance().handleChangeTab(event, 'phoenix');
    expect(component.state().selectedSociety).toEqual('phoenix');
  });

  it('should call verifyActivity when handleClick is invoked without role as SUCCESS_OPS', () => {
    component.setProps({ userRoles: ['cio'] });
    const instance = component.instance();
    instance.handleClick('approved', '1234t645');
    expect(verifyActivitySpy.called).toBeTruthy();
  });

  it('should call verifyActivitiesOps when handleClick is invoked with role as SUCCESS_OPS', () => {
    component.setProps({ userRoles: roles });
    const instance = component.instance();
    instance.handleClick('approved', '1234t645');
    expect(verifyActivitiesOpsSpy.called).toBeTruthy();
  });

  it('should call verifyActivity when handleClick is invoked with reject action and role as society secretary', () => {
    component.setProps({ userRoles: ['society secretary'] });
    const instance = component.instance();
    instance.handleClick('rejected', '1234t645');
    expect(verifyActivitySpy.called).toBeTruthy();
  });

  it('should change state of showModal to true when handleClick is invoked with the MORE_INFO click action', () => {
    component.setProps({ userRoles: roles });
    component.setState({ filteredActivities: [activity], showModal: false });
    const instance = component.instance();
    instance.handleClick('moreInfo', '8437fa68-8e6b-11e8-a05c-9801a7ae0330');
    expect(component.state().showModal).toBeTruthy();
  });

  it('should change state of selectedActivity to {} when deselectActivity is invoked ', () => {
    component.setProps({ userRoles: roles });
    const instance = component.instance();
    component.setState({ selectedActivity: activity });
    instance.deselectActivity();
    expect(component.state().showModal).toBeFalsy();
    expect(component.state().selectedActivity).toEqual({});
  });
});
