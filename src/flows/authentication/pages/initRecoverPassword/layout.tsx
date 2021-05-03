import React, { useCallback, useEffect, useState } from 'react';
import { Backdrop, Box, Button, CircularProgress, Grid, Paper, TextField, Typography } from '@material-ui/core';

import CornerTriangle from '../../../../components/CornerTriangle';
import  AnimatedGrid  from '../../../../components/AnimationGrid';


interface Props {
    isLoading: boolean;

    onRecoverPassword(email: string): Promise<void>;
}

const InitRecoverPasswordLayout: React.FC<Props> = ({isLoading, onRecoverPassword}) => {
    const [email, setEmail] = useState<string>('');

    const [canSubmit, setCanSubmit] = useState<boolean>(false);

    useEffect(() => {
       
            if (email) {
                setCanSubmit(true);
            } else {
                setCanSubmit(false);
            }
        
    }, [email]);

    const onSubmit = useCallback(async () => {
        if(canSubmit) {
            onRecoverPassword(email)
        }
    }, [canSubmit, onRecoverPassword, email]);

    return (
        <Box height="100vh" display="flex" alignItems="center" justifyContent="center" paddingBottom={16}>
            <CornerTriangle />
            <AnimatedGrid container item xs={12} sm={12} md={8} alignContent="center" justify="center" animationDirection="right" >
                <Paper style={{ width: '100%', padding: 16 }}>
                    <Grid container direction="column" spacing={4}>
                        <Grid item>
                            <Typography variant="h5">Enviaremos um e-mail com o passo a passo para trocar sua senha</Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                label="E-mail"
                                fullWidth
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                            />
                        </Grid>
                        <Grid item>
                            <Button disabled={!canSubmit} onClick={onSubmit} color="primary" variant="contained" fullWidth >Enviar</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </AnimatedGrid>
            <Backdrop open={isLoading} style={{ zIndex: 50 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    )
}



export default InitRecoverPasswordLayout;