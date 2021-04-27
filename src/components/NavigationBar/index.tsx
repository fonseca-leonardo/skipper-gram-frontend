import React from 'react'
import { useHistory } from 'react-router-dom';
import { List, Paper, Link, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import { PrivateRoutes } from '../../constants/Routes';

export default function NavigationBar() {
    const history = useHistory();
    return (
        <Paper>
            <List component="nav">
                {
                    PrivateRoutes.map(route => (
                        route.listable &&
                        <Link key={route.path} color={history.location.pathname === route.path ? 'primary' : 'inherit'} href={route.path} >
                            <ListItem button>
                                    <ListItemIcon>
                                        {route.Icon && route.Icon({ path: route.path, currentPath: history.location.pathname })}
                                    </ListItemIcon>
                                    <ListItemText primary={route.title} />
                            </ListItem>
                        </Link>
                    ))
                }
            </List>
        </Paper>
        
    )
}
