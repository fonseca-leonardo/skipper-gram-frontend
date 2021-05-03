import React from 'react'
import styled from 'styled-components';
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import QRCode from 'qrcode.react';

import NavigationBar from '../../../../components/NavigationBar'
import Topbar from '../../../../components/Topbar';
import PageContainer from '../../../../components/PageContainer';

const QRCodeContainer = styled(Paper)`
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;


const MessageContainer = styled(Paper)`
    padding: 16px;
    display: flex;
    flex-direction: column;

    h2 {
        margin-bottom: 16px;
    }

    button {
        margin-top: 16px;
        align-self: flex-end;
        max-width: 80px;
    }
`;

 const SupportLayoutPage: React.FC = () => {
    const theme = useTheme();
    console.log(theme.palette.background.default)
    return (
        <PageContainer>
            <Topbar title="SUPORTE" />
            <Grid container spacing={6} justify="flex-start" alignContent="flex-start" style={{ marginTop: 32 }}>
                <Grid item md={3} >
                    <NavigationBar />
                </Grid>
                <Grid container item md={9} justify="space-between" spacing={4} >
                    <Grid item md={8}>
                        <MessageContainer>
                            <Typography component="h2" >Para sugestões e contato deixa aqui sua mensagem.</Typography>
                            <TextField  
                                id="outlined-multiline-static"
                                label="Mensagem"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"/>
                                <Button variant="contained" color="primary">ENVIAR</Button>
                        </MessageContainer>
                    </Grid>
                    <Grid item md={4}>
                        <QRCodeContainer>
                            <QRCode value="00020126580014br.gov.bcb.pix0136f3981c27-1f95-4d3b-87ac-03e7f61f4c44520400005303986540510.005802BR5925LEONARDO RODRIGUES FONSEC6010PETROPOLIS62410503***50300017br.gov.bcb.brcode01051.0.063044068" size={200} bgColor={theme.palette.background.paper} fgColor="#fff" />
                            <br />
                            <Typography>Quer apoiar o projeto?</Typography>
                            <Typography>Me pague um café, mandando um PIX </Typography>
                            <Typography>😄☕</Typography>
                        </QRCodeContainer>
                    </Grid>
                    
                </Grid>
            </Grid>
        </PageContainer>
    )
}


export default SupportLayoutPage