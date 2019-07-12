import {renderHook} from "react-hooks-testing-library";
import useCommonFormUtils from "./useCommonFormUtils";

describe('useCommonFormUtils', () => {
   it('adds submit to components if form and no submit exists', () => {
       const form = {
           display: 'form',
           components: []
       };
       const {result} = renderHook(() => useCommonFormUtils());
       result.current.handleForm(form);
       expect(form.components.length).toBe(1);
   });
   it('removes submit button if wizard and submit button exists', () => {
       const form = {
           display: 'wizard',
           components: [
               {
                   "autofocus": false,
                   "input": true,
                   "label": "Submit",
                   "tableView": false,
                   "key": "submit",
                   "size": "md",
                   "leftIcon": "",
                   "rightIcon": "",
                   "block": false,
                   "action": "submit",
                   "disableOnInvalid": false,
                   "theme": "primary",
                   "type": "button"
               }
           ]
       };
       const {result} = renderHook(() => useCommonFormUtils());
       result.current.handleForm(form);
       expect(form.components.length).toBe(0);
   });

   it('can get submission access', () => {
       const {result} = renderHook(() => useCommonFormUtils());
       const submissionAccess = result.current.submissionAccess('id');
       expect(submissionAccess.length).toBe(8);
   });
   it('provides form choices', () => {
       const {result} = renderHook(() => useCommonFormUtils());
       const formChoices = result.current.formChoices;
       expect(formChoices.length).toBe(2);
   });
});
