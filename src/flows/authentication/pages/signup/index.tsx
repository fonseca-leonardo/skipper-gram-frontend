import React, {  useState } from 'react';
import { useHistory } from 'react-router';

import UserService from '../../../../services/UserService';
import SignUpLayout from './layout'

export interface ISignUpForm {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
}

const SignUpPage: React.FC = () => {
    const [ isLoading, setIsLoading ] = useState(false);

    const history = useHistory();

    const _onRegister = async (email: string, password: string, name: string) => {
        try {
            setIsLoading(true);

            await UserService.signUp(email, password, name);

            history.push('/');
     
           setIsLoading(false);
        } catch (error) {
           setIsLoading(false);
        }
    }

    return (
        <SignUpLayout isLoading={isLoading} onRegister={_onRegister} />
    )
}

export default SignUpPage;
