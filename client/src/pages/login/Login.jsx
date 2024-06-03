import React from 'react';
import { connectIdentity } from '../../AppConfig';
import { deleteToken, getToken, isTokenValid, getTokenObj } from '../../helper/userToken';

const Login = () => {

    const userToken = getToken();
    if (isTokenValid(userToken)) {
        window.location.href = window.location.origin + '/author-switch?Token=' + getTokenObj();
    } else {
        deleteToken();
        window.location.href = connectIdentity;
    }
    return (
        <div>
            
        </div>
    );
};

export default Login;