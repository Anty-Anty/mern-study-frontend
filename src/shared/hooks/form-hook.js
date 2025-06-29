// we keep here all useReducer logic which was set up in NewPlace initially.

import { useCallback, useReducer } from "react";

// lecture 64 useReducer
const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for (const inputId in state.inputs) {
                //authorisation (fix the issue of switching modes)
                if(!state.inputs[inputId]){
                    continue;
                }
                // if any 
                if (inputId === action.inputId) {
                    // formIsValid(1) = formIsValid(2) && action.isValid . formIsValid(2) makes sure that action.isValid has the same value with formIsValid(1), therefore 'true'.
                    //otherwise without formIsValid(2), would have been equal to action.isValid
                    // later if inputs.isValid is true then formState.isValid is true and button stops been disabled
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: { value: action.value, isValid: action.isValid }
                },
                isValid: formIsValid
            };
// lecture 70 SET_DATA to udate dummy data in UpdatePlace.js after information recived from data base
        case 'SET_DATA':
            return {
                // previous state is not copied, but replaced entirly
                inputs: action.inputs,
                isValid: action.formIsValid
            };

        default:
            return state;
    }
};

export const useForm = (initialInputs, initialFormValidity) => {
    
    // lesson 63, functions are passed to Input.js 
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity
    });

     // useCallback with empty [] dependencies, means that when componenet function rerenders, 
    // this function is reused and not rerenders
      // useCallback An empty array ([]) means the function will only be created once (on initial render).
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id

        });
    }, []);

    // lecture 70 adding function to deal with posible delay in requesting information from database
    // useCallback An empty array ([]) means the function will only be created once (on initial render).
    const setFormData = useCallback((inputData, formValidity)=>{
        dispatch({
            type:'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        })
    },[]);

    return [formState, inputHandler, setFormData]
};