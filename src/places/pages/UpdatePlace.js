import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { VALIDATOR_REQUIRE, VALIDATOR_MIN, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from "../../shared/hooks/http-hook";
import {AuthContext} from '../../shared/context/auth-context';
import './PlaceForm.css';

// const DUMMY_PLACES = [
//     {
//         id: 'p1',
//         title: 'Empire State Building',
//         description: 'One of the most famous skyscrapers in the world',
//         imageUrl: 'https://www.travelguide.net/media/1440x960/Empire-State-Building-1440x960.avif',
//         adress: 'New York',
//         location: {
//             lat: 40.7484405,
//             lag: -73.9882393
//         },
//         creator: 'u1'
//     },
//     {

//         id: 'p2',
//         title: 'Emp. State Building',
//         description: 'One of the most famous skyscrapers in the world',
//         imageUrl: 'https://www.travelguide.net/media/1440x960/Empire-State-Building-1440x960.avif',
//         adress: 'New York',
//         location: {
//             lat: 40.7484405,
//             lag: -73.9882393
//         },
//         creator: 'u2'
//     }
// ];

const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();

    // const [isLoading, setIsLoading] = useState(true);

    const placeId = useParams().placeId;
    const history = useHistory();

    // const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

    const [formState, inputHandler, setFormData] = useForm({
        // lecture 70 dummy data to initialise
        title: {
            // value: identifiedPlace.title,
            // isValid: true
            value: '',
            isValid: false
        },
        description: {
            // value: identifiedPlace.description,
            // isValid: true
            value: '',
            isValid: false
        }
    }, false)

    //lect 159 fetching place
    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
                );
                setLoadedPlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.description,
                        isValid: true
                    }
                }, true);
            } catch (err) { };
        };
        fetchPlace()
    }, [sendRequest, placeId, setFormData]);

    // lecture 70 adding function to deal with posible delay in requesting information from database
    // useEffect(() => {
    //     if (identifiedPlace) {
    //         setFormData({
    //             title: {
    //                 value: identifiedPlace.title,
    //                 isValid: true
    //             },
    //             description: {
    //                 value: identifiedPlace.description,
    //                 isValid: true
    //             }
    //         }, true);
    //     };
    //     setIsLoading(false);
    // }, [setFormData, identifiedPlace])

    //lect 159 updating place
    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        try{
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`, 'PATCH', JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value
        }), 
        {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
            
        }
        );
        history.push('/' + auth.userId + '/places' )
        } catch (err) {}
        
    };

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    // if (!identifiedPlace) {
    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card><h2>Could not find place!</h2></Card>
            </div>
        );
    }




    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
                <Input
                    id='title'
                    element='input'
                    type='text'
                    label='Title'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                    // 'inputs' is a name of array in useForm
                    initialValue={loadedPlace.title}
                    initialValid={true}
                />
                <Input
                    id='description'
                    element='textarea'
                    label='Description'
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid discription (min 5 characters)."
                    onInput={inputHandler}
                    initialValue={loadedPlace.description}
                    initialValid={true}
                />
                <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE</Button>
            </form>}
        </>
    );
};

export default UpdatePlace;