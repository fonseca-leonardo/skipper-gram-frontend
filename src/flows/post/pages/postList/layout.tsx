import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { 
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    IconButton, Grid,
    TextField, TableFooter, TablePagination,
    InputAdornment, TextFieldProps, CircularProgress, Button,
    Dialog, DialogTitle, DialogContent,
    DialogActions, DialogContentText, Checkbox, Backdrop,
} from '@material-ui/core';
import { Delete, Edit, Search, IndeterminateCheckBox, CheckBox } from '@material-ui/icons';
import { DebounceInput } from 'react-debounce-input';

import parseISODate from '../../../../utils/parseISODate';
import ColorChip from '../../../../components/ColorChip';
import IPost from '../../../../models/IPost';
import NavigationBar from '../../../../components/NavigationBar';
import Topbar from '../../../../components/Topbar';
import PageContainer from '../../../../components/PageContainer';

const DebounceTextField = ({ ...props }: TextFieldProps) => (
    <TextField
        InputProps={{ startAdornment: (
            <InputAdornment position="start">
                <Search htmlColor="#bbb"/>
            </InputAdornment>
        ) }} {...props} />
);

interface Props {
    postList: IPost[];

    isPageLoading: boolean;

    isTableLoading: boolean;

    count: number;

    onCreatePost(title: string): Promise<string>;

    onDeleteSinglePost(postId: string): Promise<void>

    onFetchPostList(searchTerm: string, skip: number, take: number): Promise<void>;
}

export default function PostListLayout({ postList, isTableLoading, isPageLoading, count, onDeleteSinglePost, onCreatePost, onFetchPostList }: Props) {
    const history = useHistory();

    const [tableProps, setTableProps] = useState({
        searchTerm: '',
        page: 0,
        rowsPerPage: 10,
        count
    });

    const [newPost, setNewPost] = useState({ title: '' })

    useEffect(() => {
        setTableProps(prev=> ({...prev, count}))
    }, [count]);

    const [dialogOpen, setDialogOpen] = useState(false);

    const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);

    const handleOpenDialog = useCallback(() => {
        setDialogOpen(true);
    }, [])

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const handleConfirmDialog = useCallback(async () => {
        try {
            setDialogOpen(false);
            const id = await onCreatePost(newPost.title);
            history.push(`/post/${id}`);
        } catch (error) {
            setDialogOpen(false);
        }
    }, [history, onCreatePost, newPost])
    
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
            setSelectedRows(postList.map(post => post._id))
        } else {
            setSelectedRows([]);
        }
    }, [postList]);

    const onSearchTermChange = async (searchTerm: string) => {
        setTableProps(prev => ({...prev, searchTerm }));

        const {page, rowsPerPage} = tableProps;

        const skip = page * rowsPerPage;

        await onFetchPostList(searchTerm, skip, rowsPerPage);

    }

    const _onItemsPerPageChange = async (rowsPerPage: number) => {
        setTableProps(prev => ({...prev, rowsPerPage }));

        const skip = tableProps.page * rowsPerPage;

        await onFetchPostList(tableProps.searchTerm, skip, rowsPerPage);
    }

    const _onPageChange = async (page: number) => {
        setTableProps(prev => ({...prev, page }));

        const skip = page * tableProps.rowsPerPage;

        await onFetchPostList(tableProps.searchTerm, skip, tableProps.rowsPerPage);
    }

    const _onDeleteSinglePost = async (postId: string) => {
        await onDeleteSinglePost(postId);

        const skip = tableProps.page * tableProps.rowsPerPage;

        await onFetchPostList(tableProps.searchTerm, skip, tableProps.rowsPerPage);
    }

    return (
        <PageContainer>
            <Topbar title="POSTAGENS" />
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
                                            onChange={(e) => onSearchTermChange(e.target.value)}
                                            value={tableProps.searchTerm}
                                            placeholder="Buscar"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    {/* <TableCell width={50}>
                                        <Checkbox
                                            color="primary"
                                            checked={(selectedRows.length > 0) ? ((selectedRows.length === postList.length) ? true : false): false}
                                            onChange={_onSelectAll}
                                            icon={(selectedRows.length > 0) ? ((selectedRows.length === postList.length) ? <CheckBox color="primary"/> : <IndeterminateCheckBox color="primary" /> ) : undefined}
                                        />
                                    </TableCell> */}
                                    <TableCell width={330}>Título</TableCell>
                                    <TableCell width={200}>Campanha</TableCell>
                                    <TableCell width={150}>Ult. Atualização</TableCell>
                                    <TableCell width={130}>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            {
                                isTableLoading ? (
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
                                                <TableRow hover key={post._id} >
                                                    {/* <TableCell>
                                                        <Checkbox color="primary" checked={_isChecked(post._id)} onChange={() => _onSelectRow(post._id)}/>
                                                    </TableCell> */}
                                                    <TableCell>{post.title}</TableCell>
                                                        {
                                                            post.campaign ? (
                                                                <TableCell>
                                                                <ColorChip label={post.campaign.title} htmlColor={post.campaign.tagColor}/>
                                                                </TableCell>
                                                            ) : (
                                                                <TableCell >
                                                                    -
                                                                </TableCell>  
                                                            )
                                                        }
                                                    <TableCell>{parseISODate(post.updatedAt, 'dd/MM/yyyy HH:mm')}</TableCell>
                                                    <TableCell>
                                                        <Link to={`/post/${post._id}`}>
                                                        <IconButton color="primary">
                                                            <Edit />
                                                        </IconButton>
                                                        </Link>
                                                        <IconButton color="secondary" onClick={() => _onDeleteSinglePost(post._id)}>
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
                                                    onChangePage={(_, page) => _onPageChange(page) }
                                                    page={tableProps.page}
                                                    rowsPerPage={tableProps.rowsPerPage}
                                                    onChangeRowsPerPage={(e) => _onItemsPerPageChange(Number(e.target.value))}
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
                    <TextField label="Título" fullWidth onChange={(e) => setNewPost(prev => ({...prev, title: e.target.value}))}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
                    <Button onClick={handleConfirmDialog} variant="contained" color="primary">Começar</Button>
                </DialogActions>
            </Dialog>
            <Backdrop open={isPageLoading} style={{ zIndex: 5 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </PageContainer>
    )
}
