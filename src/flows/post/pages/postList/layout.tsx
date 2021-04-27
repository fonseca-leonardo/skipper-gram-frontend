import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    IconButton, Grid,
    TextField, TableFooter, TablePagination,
    InputAdornment, TextFieldProps, CircularProgress, Button,
    Dialog, DialogTitle, DialogContent,
    DialogActions, DialogContentText, Checkbox,
} from '@material-ui/core';
import { Delete, Edit, Search, IndeterminateCheckBox, CheckBox } from '@material-ui/icons';
import { DebounceInput } from 'react-debounce-input';

import parseISODate from '../../../../utils/parseISODate';
import ColorChip from '../../../../components/ColorChip';
import IPost from '../../../../models/IPost';
import NavigationBar from '../../../../components/NavigationBar';
import Topbar from '../../../../components/Topbar';

const DebounceTextField = ({ ...props }: TextFieldProps) => (
    <TextField
        InputProps={{ startAdornment: (
            <InputAdornment position="start">
                <Search htmlColor="#bbb"/>
            </InputAdornment>
        ) }} {...props} />
)


interface Props {
    postList: IPost[];
    isLoading: boolean;
}

export default function PostListLayout({ postList, isLoading }: Props) {
    const history = useHistory();

    const [tableProps, setTableProps] = useState({
        searchTerm: '',
        page: 1,
        rowsPerPage: 10,
        count: 30
    });

    const [dialogOpen, setDialogOpen] = useState(false);

    const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);

    const handleOpenDialog = useCallback(() => {
        setDialogOpen(true);
    }, [])

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const handleConfirmDialog = useCallback(() => {
        try {
            history.push('/post/123')
            setDialogOpen(false);

        } catch (error) {
            
        }
    }, [history])
    
    const _isChecked = useCallback((id: string | number): boolean => {
        const isChecked = selectedRows.find(item => item === id);

        return !!isChecked;
    }, [selectedRows]);

    const _onSelectRow = useCallback((id: string | number) => {
        const selectedIndex = selectedRows.indexOf(id);
        let newSelected: Array<string | number> = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedRows, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelected = newSelected.concat(selectedRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedRows.slice(0, selectedIndex),
                selectedRows.slice(selectedIndex + 1),
            );
        }

        setSelectedRows(newSelected);
      
    }, [selectedRows]);

    const _onSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedRows(postList.map(post => post.id))
        } else {
            setSelectedRows([]);
        }
    }, [postList]);

    return (
        <>
            <Topbar title="POSTAGENS" />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Grid container spacing={2} justify="flex-end">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleOpenDialog}>Nova Postagem</Button>
                </Grid>
            </Grid>
            <br />
            <Grid container spacing={6} justify="flex-start" alignContent="flex-start">
                <Grid item md={3} >
                    <NavigationBar />
                </Grid>
                <Grid item md={9}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <DebounceInput
                                            element={DebounceTextField}
                                            minLength={3}
                                            debounceTimeout={1000}
                                            onChange={() => { console.log("AQUI")}}
                                            value={tableProps.searchTerm}
                                            placeholder="Buscar"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell width={50}>
                                        <Checkbox
                                            color="primary"
                                            checked={(selectedRows.length > 0) ? ((selectedRows.length === postList.length) ? true : false): false}
                                            onChange={_onSelectAll}
                                            icon={(selectedRows.length > 0) ? ((selectedRows.length === postList.length) ? <CheckBox color="primary"/> : <IndeterminateCheckBox color="primary" /> ) : undefined}
                                        />
                                    </TableCell>
                                    <TableCell width={50}>ID</TableCell>
                                    <TableCell width={330}>Título</TableCell>
                                    <TableCell width={200}>Campanha</TableCell>
                                    <TableCell width={150}>Ult. Atualização</TableCell>
                                    <TableCell width={130}>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            {
                                isLoading ? (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" >
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                ) : (
                                    <>
                                        <TableBody >
                                            {postList.map(post => (
                                                <TableRow hover key={post.id} >
                                                    <TableCell>
                                                        <Checkbox color="primary" checked={_isChecked(post.id)} onChange={() => _onSelectRow(post.id)}/>
                                                    </TableCell>
                                                    <TableCell>{post.id}</TableCell>
                                                    <TableCell>{post.name}</TableCell>
                                                        {
                                                            post.campaign ? (
                                                                <TableCell>
                                                                <ColorChip label={post.campaign.name} htmlColor={post.campaign.color}/>
                                                                </TableCell>
                                                            ) : (
                                                                <TableCell >
                                                                    -
                                                                </TableCell>  
                                                            )
                                                        }
                                                    <TableCell>{parseISODate(post.lastUpdate, 'dd/MM/yyyy HH:mm')}</TableCell>
                                                    <TableCell>
                                                        <IconButton color="primary">
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton color="secondary">
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TablePagination
                                                    colSpan={5}
                                                    count={tableProps.count}
                                                    onChangePage={(_, page) => { console.log(page) }}
                                                    page={tableProps.page}
                                                    rowsPerPage={tableProps.rowsPerPage}
                                                    onChangeRowsPerPage={(e) => setTableProps({ ...tableProps, rowsPerPage: Number(e.target.value), })}
                                                />
                                            </TableRow>
                                        </TableFooter>
                                    </>
                                )
                            }
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <Dialog open={dialogOpen} maxWidth='xs' fullWidth onClose={handleCloseDialog}>
                <DialogTitle>Nova postagem</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Para começar a escrever seu post escolha um título.
                    </DialogContentText>
                    <TextField label="Título" fullWidth/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
                    <Button onClick={handleConfirmDialog} variant="contained" color="primary">Começar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
