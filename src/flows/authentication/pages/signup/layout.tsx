import React from 'react';
import styled from 'styled-components';

import { Card, CardContent, Typography, Grid, Box, TextField, Divider, Button, Link, Hidden } from '@material-ui/core';

import SignUpArt from '../../../../assets/SignUpArt.svg'

import CornerTriangle from '../../../../components/CornerTriangle';
import AnimationGrid from '../../../../components/AnimationGrid';

const Image = styled.img`
    width: 100%; 
`;

export default function SignUpLayout() {
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
                                    <TextField variant="outlined" label="E-mail" fullWidth/>
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" label="Senha" type="password" fullWidth/>
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" label="Confirmar senha" type="password" fullWidth/>
                                </Grid>
                                <Grid item >
                                    <Button variant="contained" color="primary" fullWidth>Confirmar</Button>
                                </Grid>
                                <Grid item container justify="center">
                                    <Link href="/">
                                        <Typography>Entrar</Typography>
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
