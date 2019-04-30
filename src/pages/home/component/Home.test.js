import React from 'react';
import { shallow } from 'enzyme';
import Home from "./Home";
describe("Home Page", () => {
   it ('renders hello', () => {
       const hello = <div>Hello</div>;
       const wrapper = shallow(<Home />);
       expect(wrapper.contains(hello)).toEqual(true);
   })
});
