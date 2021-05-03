import React, { useCallback, useEffect, useState } from 'react';
import { Backdrop, Box, Button, CircularProgress, Grid, Paper, TextField, Typography } from '@material-ui/core';

import CornerTriangle from '../../../../components/CornerTriangle';
import  AnimatedGrid  from '../../../../components/AnimationGrid';


interface Props {
    isLoading: boolean;

    onRecoverPassword(newPassword: string): Promise<void>;
}

interface UpdatePasswordForm {
    password: string;
    confirmPassword: string;
}

const RecoverPasswordLayout: React.FC<Props> = ({ isLoading, onRecoverPassword }) => {
    const [updatePassword, setUpdatePassword] = useState<UpdatePasswordForm>({ password: '', confirmPassword: '' });

    const [canSubmit, setCanSubmit] = useState<boolean>(false);

    const onFormChange = (data: string, key: keyof UpdatePasswordForm) => {
        setUpdatePassword(prev => ({...prev, [key]: data}));
    }

    useEffect(() => {
        if(updatePassword.password && updatePassword.confirmPassword) {
            if (updatePassword.password === updatePassword.confirmPassword) {
                setCanSubmit(true);
            } else {
                setCanSubmit(false);
            }
        } else {
            setCanSubmit(false);
        }
    }, [updatePassword]);

    const onSubmit = useCallback(async () => {
        if(canSubmit) {
            onRecoverPassword(updatePassword.password)
        }
    }, [canSubmit, onRecoverPassword, updatePassword]);

    return (
        <Box height="100vh" display="flex" alignItems="center" justifyContent="center" paddingBottom={16}>
            <CornerTriangle />
            <AnimatedGrid container item xs={12} sm={12} md={8} alignContent="center" justify="center" animationDirection="right" >
                <Paper style={{ width: '100%', padding: 16 }}>
                    <Grid container direction="column" spacing={4}>
                        <Grid item>
                            <Typography variant="h5" >Troque sua senha</Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                label="Senha"
                                fullWidth
                                value={updatePassword.password}
                                type="password"
                                onChange={(event) => onFormChange(event.target.value, 'password')}
                                onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                label="Confirmar Senha"
                                fullWidth
                                value={updatePassword.confirmPassword}
                                type="password"
                                onChange={(event) => onFormChange(event.target.value, 'confirmPassword')}
                                onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                            />
                        </Grid>
                        <Grid item>
                            <Button disabled={!canSubmit} onClick={onSubmit} color="primary" variant="contained" fullWidth >Trocar</Button>
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

export default RecoverPasswordLayout 
