import React, { useState, useCallback, useEffect } from 'react';
import { ColorPicker } from 'material-ui-color';

import { Grid, Button, TableContainer,
    Paper, Table, TableHead, TableRow, TableCell, TextField, InputAdornment,
    TextFieldProps, TableBody, CircularProgress, IconButton, TableFooter, TablePagination,
    Hidden,
    Backdrop,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    FormControl,
    Input,
    Chip,
    Typography,
} from '@material-ui/core';

import { Delete, Edit, Search } from '@material-ui/icons';
import { DebounceInput } from 'react-debounce-input';

import NavigationBar from '../../../../components/NavigationBar';
import IHashTags from '../../../../models/IHashTag';
import Topbar from '../../../../components/Topbar';
import PageContainer from '../../../../components/PageContainer';

const DebounceTextField = ({ ...props }: TextFieldProps) => (
    <TextField
        InputProps={{ startAdornment: (
            <InputAdornment position="start">
                <Search htmlColor="#bbb"/>
            </InputAdornment>
        ) }} {...props} />
)


interface Props {
    hashTagList: IHashTags[];

    isTableLoading: boolean;

    isPageLoading: boolean;

    count: number;

    onCreateHashtag(data: IRequestHashtag): Promise<void>

    onFetchHashtagList(searchTerm: string, skip: number, take: number): Promise<void>;

    onDeleteHashtag(hashtagId: string): Promise<void>;

    onUpdateHashtag(hashtag: IHashTags): Promise<void>;
}

interface IRequestHashtag {
    name: string;
    tagColor: string;
    tags: string[];
    
}

export default function HashtagListLayout({ hashTagList, isTableLoading, isPageLoading, count, onCreateHashtag, onFetchHashtagList, onDeleteHashtag, onUpdateHashtag }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

    const [newHashtag, setNewHashtag] = useState<IRequestHashtag>({name: '', tagColor: '#6C61B3', tags: []});
    const [updateHashtag, setUpdateHashtag] = useState<IHashTags>({ _id: '', name: '', tagColor: '#6C61B3', tags: [], createdAt: '', updatedAt: '' });

    const [tag, setTag] = useState<string>('');

    const [tableProps, setTableProps] = useState({
        searchTerm: '',
        page: 0,
        rowsPerPage: 10,
        count
    });

    // const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);


    useEffect(() => {
        setTableProps(prev=> ({...prev, count}))
    }, [count]);


    // const _isChecked = useCallback((id: string | number): boolean => {
    //     const isChecked = selectedRows.find(item => item === id);

    //     return !!isChecked;
    // }, [selectedRows]);

    // const _onSelectRow = useCallback((id: string | number) => {
    //     const selectedIndex = selectedRows.indexOf(id);
    //     let newSelected: Array<string | number> = [];

    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selectedRows, id);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selectedRows.slice(1));
    //     } else if (selectedIndex === selectedRows.length - 1) {
    //         newSelected = newSelected.concat(selectedRows.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selectedRows.slice(0, selectedIndex),
    //             selectedRows.slice(selectedIndex + 1),
    //         );
    //     }

    //     setSelectedRows(newSelected);
      
    // }, [selectedRows]);

    // const _onSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.checked) {
    //         setSelectedRows(hashTagList.map(post => post._id))
    //     } else {
    //         setSelectedRows([]);
    //     }
    // }, [hashTagList]);

    const handleOpenDialog = useCallback(() => {
        setNewHashtag({ name: '', tagColor: '#6C61B3', tags: [] });

        setDialogOpen(true);
    }, [])

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
        setNewHashtag({ name: '', tagColor: '#6C61B3', tags: [] });
        setTag('');
    }, []);

    const handleConfirmDialog = useCallback(async () => {
        try {
            setDialogOpen(false);
            await onCreateHashtag(newHashtag);
            setTag('');
            setNewHashtag({name: '', tagColor: '#6C61B3', tags: []})
        } catch (error) {
            setDialogOpen(false);
            setTag('');
        }
    }, [newHashtag, onCreateHashtag]);
    
    const handleOpenUpdateDialog = useCallback((selectedHashtag: IHashTags) => {
        setUpdateDialogOpen(true);
        setUpdateHashtag(selectedHashtag);
    }, []);

    const handleCloseUpdateDialog = useCallback(() => {
        setUpdateDialogOpen(false);
        setUpdateHashtag({ _id: '', name: '', tagColor: '#6C61B3', tags: [], createdAt: '', updatedAt: '' });
    }, []);

    const handleConfirmUpdateDialog = useCallback(async() => {
        try {
            setUpdateDialogOpen(false);

            await onUpdateHashtag(updateHashtag);

            setUpdateHashtag({ _id: '', name: '', tagColor: '#6C61B3', tags: [], createdAt: '', updatedAt: '' })
            setTag('');
        } catch (error) {
            setUpdateDialogOpen(false);
            setUpdateHashtag({ _id: '', name: '', tagColor: '#6C61B3', tags: [], createdAt: '', updatedAt: '' })
            setTag('');

        }
    }, [updateHashtag, onUpdateHashtag]);

    const onAddTagToHashtag = () => {
        if (tag) {
            setNewHashtag(prev => ({...prev, tags: [...prev.tags, `#${tag}`] }));
            setTag('');
        }
    }

    const onUpdateTagToHashtag = () => {
        if (tag) {
            setUpdateHashtag(prev => ({...prev, tags: [...prev.tags, `#${tag}`] }));
            setTag('');
        }
        
    }

    const handleDeleteTag = (selectedTag: string) => {
        const updatedTags = newHashtag.tags.filter(tag => tag !== selectedTag);
        setNewHashtag(prev => ({...prev, tags: updatedTags }));

    }

    const handleDeleteUpdateTag = (selectedTag: string) => {
        const updatedTags = updateHashtag.tags.filter(tag => tag !== selectedTag);

        setUpdateHashtag(prev => ({...prev, tags: updatedTags }));
    }

    const onSearchTermChange = async (searchTerm: string) => {
        setTableProps(prev => ({...prev, searchTerm }));

        const {page, rowsPerPage} = tableProps;

        const skip = page * rowsPerPage;

        await onFetchHashtagList(searchTerm, skip, rowsPerPage);

    }

    const _onItemsPerPageChange = async (rowsPerPage: number) => {
        setTableProps(prev => ({...prev, rowsPerPage }));

        const skip = tableProps.page * rowsPerPage;

        await onFetchHashtagList(tableProps.searchTerm, skip, rowsPerPage);
    }

    const _onPageChange = async (page: number) => {
        setTableProps(prev => ({...prev, page }));

        const skip = page * tableProps.rowsPerPage;

        await onFetchHashtagList(tableProps.searchTerm, skip, tableProps.rowsPerPage);
    }

    const _onDeleteSingleHashtag = async (hashtagId: string) => {
        console.log({hashtagId});
        await onDeleteHashtag(hashtagId);

        const skip = tableProps.page * tableProps.rowsPerPage;

        await onFetchHashtagList(tableProps.searchTerm, skip, tableProps.rowsPerPage);
    }


    return (
        <PageContainer>
            <Topbar title="HASHTAGS"/>
            <Grid container spacing={2} justify="flex-end" >
                <Grid item sm={12} xs={12} md={2} >
                    <Button fullWidth variant="contained" color="primary" onClick={() => handleOpenDialog()}>Nova Hashtag</Button>
                </Grid>
            </Grid>
            <br />
            <Grid container spacing={6} justify="flex-start" alignContent="flex-start">
                <Hidden smDown>
                    <Grid item xs={12} md={3} >
                        <NavigationBar />
                    </Grid>
                </Hidden>
                <Grid item xs={12} md={9} >
                    <TableContainer component={Paper}>
                        <Table style={{ overflowX: 'auto' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={5}>
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
                                            checked={(selectedRows.length > 0) ? ((selectedRows.length === hashTagList.length) ? true : false): false}
                                            onChange={_onSelectAll}
                                            icon={(selectedRows.length > 0) ? ((selectedRows.length === hashTagList.length) ? <CheckBox color="primary"/> : <IndeterminateCheckBox color="primary" /> ) : undefined}
                                        />
                                    </TableCell> */}
                                    <TableCell width={200}>Nome</TableCell>
                                    <TableCell width={350}>Tags</TableCell>
                                    <TableCell width={140}>Ações</TableCell>
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
                                            {hashTagList.map(hashTag => (
                                                <TableRow hover key={hashTag._id}>
                                                    {/* <TableCell>
                                                        <Checkbox
                                                            color="primary"
                                                            checked={_isChecked(hashTag._id)}
                                                            onChange={() => _onSelectRow(hashTag._id)}
                                                        />
                                                    </TableCell> */}
                                                    <TableCell>{hashTag.name}</TableCell>
                                                    <TableCell>{hashTag.tags.map((tag, index) => (index + 1) === hashTag.tags.length ? tag : `${tag}, ` )}</TableCell>
                                                    <TableCell width="140px" scope="row">
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={6}>
                                                                <IconButton color="primary" onClick={() => handleOpenUpdateDialog(hashTag)}>
                                                                    <Edit />
                                                                </IconButton>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <IconButton color="secondary" onClick={() => _onDeleteSingleHashtag(hashTag._id)}>
                                                                    <Delete />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
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
                <DialogTitle>Nova Hashtag</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Para criar uma hashtag escolha um nome, as tags e uma cor.
                    </DialogContentText>
                    <TextField label="Nome" value={newHashtag.name} fullWidth onChange={(e) => setNewHashtag(prev => ({...prev, name: e.target.value}))}/>
                    <br />
                    <br />
                    <FormControl fullWidth>
                        <Input 
                            fullWidth
                            onKeyDown={(e) => (e.key === 'Enter') && onAddTagToHashtag()}
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            startAdornment={<InputAdornment position="start" >#</InputAdornment>}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Button size="small" color="primary" onClick={() => onAddTagToHashtag()} disabled={!tag} variant="contained">Adicionar</Button>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <br />
                    <br />
                    {
                        newHashtag.tags.length > 0 ? (
                            newHashtag.tags.map((tag, index) => (
                                <Chip key={tag + index} label={tag} color="primary" onDelete={() => handleDeleteTag(tag)} />
                            ))
                        ) : (
                            <Typography variant="caption" >Nenhuma tag adicionada</Typography>
                        )
                    }
                    <br />
                    <br />
                    <ColorPicker
                        onChange={(e) => setNewHashtag(prev => ({...prev, tagColor: e.css?.backgroundColor || prev.tagColor})) }
                        defaultValue="#6C61B3"
                        inputFormats={['hex']}
                        disableAlpha
                        value={newHashtag.tagColor} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
                    <Button onClick={handleConfirmDialog} variant="contained" color="primary">Criar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={updateDialogOpen} maxWidth='xs' fullWidth onClose={handleCloseUpdateDialog}>
                <DialogTitle>Editar Hashtag</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Para editar a hashtag escolha um nome, as tags e uma cor.
                    </DialogContentText>
                    <TextField label="Nome" fullWidth value={updateHashtag.name} onChange={(e) => setUpdateHashtag(prev => ({...prev, name: e.target.value}))}/>
                    <br />
                    <br />
                    <FormControl fullWidth>
                        <Input 
                            fullWidth
                            onKeyDown={(e) => (e.key === 'Enter') && onUpdateTagToHashtag()}
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            startAdornment={<InputAdornment position="start" >#</InputAdornment>}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Button size="small" color="primary" onClick={() => onUpdateTagToHashtag()} disabled={!tag} variant="contained">Adicionar</Button>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <br />
                    <br />
                    {
                        updateHashtag.tags.length > 0 ? (
                            updateHashtag.tags.map((tag, index) => (
                                <Chip key={tag + index} label={tag} color="primary" onDelete={() => handleDeleteUpdateTag(tag)} />
                            ))
                        ) : (
                            <Typography variant="caption" >Nenhuma tag adicionada</Typography>
                        )
                    }
                    <br />
                    <br />
                    <ColorPicker
                        onChange={(e) => setNewHashtag(prev => ({...prev, tagColor: e.css?.backgroundColor || prev.tagColor})) }
                        defaultValue="#6C61B3"
                        inputFormats={['hex']}
                        disableAlpha
                        value={updateHashtag.tagColor} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdateDialog} color="secondary">Cancelar</Button>
                    <Button onClick={handleConfirmUpdateDialog} variant="contained" color="primary">Criar</Button>
                </DialogActions>
            </Dialog>

            <Backdrop open={isPageLoading} style={{ zIndex: 50 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </PageContainer>
    )
}
