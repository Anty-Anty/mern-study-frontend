// lecture 63 new hook useCallback to avoid infinite loop made by titleInputHandler function
import React, { useContext } from "react";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom";

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
//lecture 68
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from "../../shared/context/auth-context";
import './PlaceForm.css';


const NewPlace = () => {
    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    // destructuring array to get formState and inputHandler function from useForm custom hook
    const [formState, inputHandler] = useForm({
        // first argument for a custom hook useForm function
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    },
        // second argument for a custom hook useForm function
        false);

    const history = useHistory();

    const placeSubmitHandler = async event => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('creator', auth.userId);
            formData.append('image', formState.inputs.image.value);

            await sendRequest(
                process.env.REACT_APP_BACKEND_URL+'/places',
                'POST',
                formData,
                //lect 183
                {Authorization: 'Bearer ' + auth.token}
                // JSON.stringify({
                // title: formState.inputs.title.value,
                // description: formState.inputs.description.value,
                // address: formState.inputs.address.value,
                // // lecture 157 (long explanation how to get userId by using Context)
                // creator: auth.userId
                // }),
                // { 'Content-Type': 'application/json' }
                );
                // console.log(formState.inputs)
            history.push('/');
        } catch (err) {

        }

    };
    // end 63

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <form className='place-form' onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id='title'
                    element='input'
                    type='text'
                    label='Title'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText='Please enter a valid title.'
                    onInput={inputHandler}
                />
                <Input
                    id='description'
                    element='textarea'
                    label='Description'
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText='Please enter a valid description (at least 5 characters).'
                    onInput={inputHandler}
                />
                <Input
                    id='address'
                    element='input'
                    label='Address'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText='Please enter a valid adress.'
                    onInput={inputHandler}
                />
                <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image." />
                <Button type='submit' disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
        </>
    );
};

export default NewPlace;

//my own research on how this works

// return {
//     ...state,
//     inputs: {
//         ...state.inputs,
//         [action.inputId]: { value: action.value, isValid: action.isValid }
//     },
//     isValid: formIsValid
// };

// ------------------------

// const obj = {
//     val:{
//         a:{z:1,y:2},
//         b:{z:3,y:4}
//     }
// };

// const newObj = {
//     ...obj,
//     val:{
//         ...obj.val,
//         // 'a' needs to be in quotes to make it work
//         ['a']:{z:9,y:8}
//     }
// }

// console.log (newObj)