import React from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography, Grid, Box, TextField, Button, Link, Divider, Hidden } from '@material-ui/core';

import SignIn from '../../../../assets/SignIn.svg'

import CornerTriangle from '../../../../components/CornerTriangle';
import  AnimetedGrid  from '../../../../components/AnimationGrid';

const Image = styled.img`
    width: 100%; 
`;

const LoginLayout: React.FC = () => {
 
    return (
        <Box height="100vh" display="flex" alignItems="center" justifyContent="center" paddingBottom={16}>
            <CornerTriangle />
            <AnimetedGrid xs={12} sm={10} md={8} alignContent="center" justify="center" animationDirection="right" >
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
                                    <TextField variant="outlined" label="E-mail" fullWidth/>
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" label="Senha" type="password" fullWidth/>
                                </Grid>
                                <Grid item >
                                    <Button variant="contained" color="primary" fullWidth>Confirmar</Button>
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
