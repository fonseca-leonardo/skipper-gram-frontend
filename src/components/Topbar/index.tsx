import React from 'react'
import { AppBar, Toolbar, Grid, Typography, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks'

interface Props {
    title: string;
}

 const Topbar: React.FC<Props> = ({ title }) => {
    const { signOut } = useAuth();
    return (
    <AppBar variant="elevation" color="primary">
        <Toolbar>
            <Grid container alignItems="center" spacing={2} justify="space-between">
                <Grid item>
                    <Typography variant="h6">{title}</Typography>
                </Grid>
                <Grid item>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button onClick={() => signOut()}>
                            SAIR
                        </Button>
                    </Link>
                </Grid>
            </Grid>
        </Toolbar>
    </AppBar>
    )
}

export default Topbar
