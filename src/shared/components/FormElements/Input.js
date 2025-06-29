import React, { useReducer, useEffect } from "react";

import { validate } from "../../util/validators";
import './Input.css'

// the inputReducer function is part of useReducer and outside of compounent because it doesn't 
// depend on any compounent input

// action is an object that describes the type of change to be made and includes any relevant 
// data for the update. action object is declared in dispatch function

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                // validation happens here. input value is chacked against specified in props validator type (e.g.VALIDATOR_REQUIRE())
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            };

        default:
            return state;

    }
};

const Input = props => {

    // useReducer:
    const [inputState, dispatch] = useReducer(inputReducer, { 
        //initial value is provided with props, if not then empty string
        value: props.initialValue || '', 
        isTouched: false,
        // isValid would be false for NewPlace.js and it would have prop for UpdatePlace.js
        isValid: props.initialValid || false 
    });

    // lesson 63: adding useEffect

    // deconstruct object and get values to use them as dependencies in useEffect
    // deconstruction is needed because we don't want to track all props, but only sertain parameters
    const { id, onInput } = props;
    const { value, isValid } = inputState; 

    useEffect(() => {
        // onInput forwards input by user informatopn to NewPlace.js 
        onInput (id, value, isValid)
    }, [id, value, isValid, onInput]);

    // end 63

    // functions changeHandler and touchHandler are part of useReducer, each of them trigered when input happens
    const changeHandler = event => {
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: props.validators
        });
    };

    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        })
    };

    // FIRST. element constant give us a choice between input or textarea
    const element = props.element === 'input' ? (
        <input
            id={props.id}
            type={props.type}
            placeholder={props.placeholder}
            onChange={changeHandler}
            onBlur={touchHandler}
            value={inputState.value}
        />
    ) : (
        <textarea
            id={props.id}
            rows={props.rows || 3}
            onChange={changeHandler}
            onBlur={touchHandler}
            value={inputState.value}
        />
    );

    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    );
};

export default Input; 
