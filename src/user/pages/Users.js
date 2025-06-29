import React, { useEffect, useState } from "react";

import UserList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from '../../shared/hooks/http-hook';


const Users = () => {

    // const USERS = [
    //     {id: 'u1', 
    //     name: "Bobby Brown", 
    //     image:"https://images.unsplash.com/photo-1494961104209-3c223057bd26?q=80&w=2602&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    //     places: 3
    // }
    // ];

    //moved to http-hooks.js
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();

    //lecture 153
    useEffect(() => {



        const fetchUsers = async () => {
            
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL+'/users');
                 //moved to http-hooks.js
                // const responseData = await response.json();

                // if (!response.ok) {
                //     throw new Error(responseData.message);
                // }
                setLoadedUsers(responseData.users);
            } catch (err) {
                // setError(err.message);
            };
   

        };
        fetchUsers();

    }, [sendRequest]);

    // const errorHandler = () => {
    //     setError(null);
    // };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
        </>
    )
};

export default Users; 