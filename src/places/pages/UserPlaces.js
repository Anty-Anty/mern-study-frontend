import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';


import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from '../../shared/hooks/http-hook';

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

const UserPlaces = () => {
    //lect 158
    const [loadedPlaces, setLoadedPlaces] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            
                try {

                    const responseData = await sendRequest(
                        `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`,
                       );
                    setLoadedPlaces(responseData.places);

                } catch (err) {}
            
        };
        fetchPlaces();
    }, [sendRequest, userId])

    //lect 160 updating place collection by using info from child compounent with help of function
    const placeDeletedHandler = deletedPlaceId => {
        setLoadedPlaces(prevPlaces => 
            prevPlaces.filter(place=>place.id !== deletedPlaceId)
        ); 
    };

    // const loadedPlaces = DUMMY_PLACES.filter(place=>place.creator === userId);
    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div className="center">
                <LoadingSpinner />
            </div>}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/>}
        </>
    )
};

export default UserPlaces;