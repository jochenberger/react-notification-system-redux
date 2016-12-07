import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { jsdom } from 'jsdom';
import sinon from 'sinon';
import Component from '../../src/notifications';
import NotifySystem from 'react-notification-system';

const createDOM = () => jsdom('<!doctype html><html><body><div></div></body></html>');

describe('NotificationsComponent', () => {
  let DOM;

  const notification = {
    title: 'Hey, it\'s good to see you!',
    message: 'Now you can see how easy it is to use notifications in React!',
    dismissible: false,
    level: 'info',
    uid: 'demo-uid',
    autoDismiss: 5,
  };

  const mountComponent = props => mount(
    <Component
      notifications={[]}
      {...props}
    />, {
      attachTo: DOM.body.firstChild,
      context: {
        store: {
          dispatch: () => {}
        }
      }
    }
  );

  beforeEach(() => {
    DOM = createDOM();
  });

  it('should render one <NotifySystem /> component', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(NotifySystem).length).to.equal(1);
  });

  it('should warn if prop:notifications is not array', () => {
    const c = sinon.stub(console, 'error');

    const wrapper = mountComponent({ notifications: 1 });
    const warning = c.args[0][0];

    c.restore();

    expect(warning).to.match(/Invalid prop `notifications` of type `number` supplied to `Notifications`, expected `array`./);
  });

  it('should render a single notification', () => {
    const wrapper = mountComponent();

    wrapper.setProps({
      notifications: [notification]
    });

    expect(wrapper.html()).to.have.string(notification.title);
    expect(wrapper.html()).to.have.string(notification.message);
  });

  it('calls onRemove once the notification is auto dismissed', (done) => {
    const wrapper = mountComponent();
    const onRemove = sinon.spy();

    wrapper.setProps({
      notifications: [{
        ...notification,
        autoDismiss: 1,
        onRemove
      }]
    });

    setTimeout(() => {
      expect(onRemove.called).to.be.true;
      done();
    }, 1100);
  });

  it('calls onRemove once the notification is manually dismissed', (done) => {
    const wrapper = mountComponent();
    const onRemove = sinon.spy();
    const onCallback = sinon.spy();

    wrapper.setProps({
      notifications: [{
        ...notification,
        autoDismiss: 0,
        action: {
          label: 'Dismiss',
          callback: onCallback
        },
        onRemove
      }]
    });

    wrapper.find('button').simulate('click');

    setTimeout(() => {
      expect(onCallback.called).to.be.true;
      expect(onRemove.called).to.be.true;
      done();
    }, 50);
  });

  it('calls onRemove once the notification is auto dismissed while style is false', (done) => {
    const wrapper = mountComponent({ style: false });
    const onRemove = sinon.spy();

    wrapper.setProps({
      notifications: [{
        ...notification,
        autoDismiss: 1,
        onRemove
      }]
    });

    setTimeout(() => {
      expect(onRemove.called).to.be.true;
      done();
    }, 1100);
  });

  it('calls onRemove once the notification is manually dismissed while style is false', (done) => {
    const wrapper = mountComponent({ style: false });
    const onRemove = sinon.spy();
    const onCallback = sinon.spy();

    wrapper.setProps({
      notifications: [{
        ...notification,
        autoDismiss: 0,
        action: {
          label: 'Dismiss',
          callback: onCallback
        },
        onRemove
      }]
    });

    wrapper.find('button').simulate('click');

    setTimeout(() => {
      expect(onCallback.called).to.be.true;
      expect(onRemove.called).to.be.true;
      done();
    }, 50);
  });
});