import React from 'react';
import { mount } from 'enzyme';
import { Input } from './index';


describe('Input component tests', () => {
  let wrapper;
  let myMock;

  beforeEach(() => {
    myMock = jest.fn();
    wrapper = mount(<Input
      type="text"
      value="test"
      name="test"
      htmlId="test"
      label="test"
      errorMessage=""
      onInput={(e) => myMock(e)}
    />);
  });

  it('should test that the forms oninput function is called once at least once', () => {
    const userName = 'Tester';
    wrapper.find('input[name="test"]').first().simulate('change', { target: { value: userName, name: 'test' } });
    expect(myMock.mock.calls.length).toBeGreaterThanOrEqual(1);
  });
});
