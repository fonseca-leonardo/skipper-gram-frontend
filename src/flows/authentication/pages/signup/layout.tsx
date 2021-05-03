import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Card, CardContent, Typography, Grid, Box, TextField, Divider, Button, Link, Hidden, CircularProgress } from '@material-ui/core';

import SignUpArt from '../../../../assets/SignUpArt.svg'

import CornerTriangle from '../../../../components/CornerTriangle';
import AnimationGrid from '../../../../components/AnimationGrid';

import { ISignUpForm } from '.';

const Image = styled.img`
    width: 100%; 
`;

interface Props {
    isLoading: boolean;
    onRegister(email: string, password: string, name: string): Promise<void>;
}

const SignUpLayout: React.FC<Props> = ({ isLoading, onRegister }) => {
    const [signUpForm, setSignUpForm] = useState<ISignUpForm>({email: '', password: '', confirmPassword: '', name: ''});

    const [canSubmit, setCanSubmit] = useState<boolean>(false);

    const onSignUpFormChange = (data: string, key: keyof ISignUpForm) => {
        setSignUpForm(prev => ({...prev, [key]: data}));
    }

    const onSubmitForm = async () => {
        const { email, password, name } = signUpForm;
        if (canSubmit) {
            await onRegister(email, password, name);
        }
    }

    const keyDown = async (event: React.KeyboardEvent<HTMLDivElement> ) => {
        const { email, password, name } = signUpForm;
        if (canSubmit) {
            if(event.key === "Enter") {
                await onRegister(email, password, name);
            }
        }
    }

    useEffect(() => {
        const { email, password, confirmPassword, name } = signUpForm;
        if (!!email && !!password && !!confirmPassword && !!name) {
            if (password !== confirmPassword) {
                setCanSubmit(false);
                return;
            }
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }

    }, [signUpForm]);

    return (
        <Box height="100vh" display="flex" alignItems="center" justifyContent="center" paddingBottom={16}>
            <CornerTriangle />
            <AnimationGrid xs={12} sm={10} md={8} alignContent="center" justify="center" animationDirection="top">
                <Card elevation={10} >
                    <CardContent>
                        <Grid container direction="row-reverse" justify="center" alignItems="center" spacing={4}>
                            <Hidden smDown>
                                <Grid item md={6}>
                                    <Image src={SignUpArt} alt="Registrar"/>
                                </Grid>
                            </Hidden>
                            <Divider orientation="vertical" flexItem/>
                            <Grid item container direction="column" spacing={3} md={6}>
                                <Grid item>
                                    <Typography variant="h4">Registrar</Typography>
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" label="Nome" fullWidth onKeyDown={keyDown} onChange={(event) => onSignUpFormChange(event.target.value, 'name')}/>
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" label="E-mail" fullWidth onKeyDown={keyDown} onChange={(event) => onSignUpFormChange(event.target.value, 'email')}/>
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" label="Senha" type="password" fullWidth onKeyDown={keyDown} onChange={(event) => onSignUpFormChange(event.target.value, 'password')}/>
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" label="Confirmar senha" type="password" fullWidth onKeyDown={keyDown} onChange={(event) => onSignUpFormChange(event.target.value, 'confirmPassword')}/>
                                </Grid>
                                <Grid item >
                                    <Button variant="contained" color="primary" fullWidth disabled={!canSubmit} onClick={onSubmitForm}>
                                        {
                                            isLoading ? <CircularProgress color="secondary" style={{ color: 'white'}} size={24} /> : <Typography>Confirmar</Typography>
                                        }
                                    </Button>
                                </Grid>
                                <Grid item container justify="center">
                                    <Link href="/">
                                        <Typography variant="h6">Login</Typography>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </AnimationGrid>
        </Box>
    )
}

export default SignUpLayout;