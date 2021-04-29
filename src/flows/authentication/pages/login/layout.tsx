import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography, Grid, Box, TextField, Button, Link, Divider, Hidden, CircularProgress } from '@material-ui/core';

import SignIn from '../../../../assets/SignIn.svg'

import CornerTriangle from '../../../../components/CornerTriangle';
import  AnimetedGrid  from '../../../../components/AnimationGrid';

import { LoginForm } from '.';

const Image = styled.img`
    width: 100%; 
`;


interface Props {
    isLoading: boolean;
    onLogin(data: LoginForm): Promise<void>;
}

const LoginLayout: React.FC<Props> = ({ isLoading, onLogin }) => {
    const [loginForm, setLoginForm] = useState<LoginForm>({email: '', password: ''});

    const [canSubmit, setCanSubmit] = useState<boolean>((!!loginForm.email && !!loginForm.password));

    const onLoginFormChange = (data: string, key: keyof LoginForm) => {

        setLoginForm(prev => ({...prev, [key]: data}));
    }

    const keyDown = async (event: React.KeyboardEvent<HTMLDivElement> ) => {
        if (canSubmit) {
            if(event.key === "Enter") {
                await onLogin(loginForm);
            }
        }
    }

    useEffect(() => {
        setCanSubmit((!!loginForm.email && !!loginForm.password))
    }, [loginForm])

    return (
        <Box height="100vh" display="flex" alignItems="center" justifyContent="center" paddingBottom={16}>
            <CornerTriangle />
            <AnimetedGrid container item xs={12} sm={10} md={8} alignContent="center" justify="center" animationDirection="right" >
                <Card elevation={10} >
                    <CardContent>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                            <Hidden smDown>
                                <Grid item md={6}>
                                    <Image src={SignIn} alt="Entrar"/>
                                </Grid>
                            </Hidden>
                            <Divider orientation="vertical" flexItem/>
                            <Grid item container direction="column" spacing={3} md={6}>
                                <Grid item>
                                    <Typography variant="h4">Login</Typography>
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" label="E-mail" fullWidth value={loginForm.email} onChange={(event) => onLoginFormChange(event.target.value, 'email')} />
                                </Grid>
                                <Grid item>
                                    <TextField
                                    variant="outlined"
                                    label="Senha"
                                    type="password"
                                    value={loginForm.password}
                                    onKeyDown={keyDown}
                                    onChange={(event) => onLoginFormChange(event.target.value, 'password')}
                                    fullWidth
                                />
                                </Grid>
                                <Grid item >
                                    <Button variant="contained" color="primary" fullWidth onClick={() => onLogin(loginForm)} disabled={!canSubmit} >
                                    {
                                        isLoading ? <CircularProgress color="secondary" style={{ color: 'white'}} size={24} /> : <Typography>Confirmar</Typography>
                                    }
                                    </Button>
                                </Grid>
                                <Grid item container justify="center">
                                    <Link href="/cadastrar">
                                        <Typography>Cadastrar</Typography>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </AnimetedGrid>
        </Box>
    )
}

export default  LoginLayout;
