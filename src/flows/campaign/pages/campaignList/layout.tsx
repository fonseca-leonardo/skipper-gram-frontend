import React, { useCallback, useState } from 'react';

import { Button, Grid, Paper, Table, TableCell, InputAdornment, 
    TableContainer, TableHead, TableRow, TextField, TextFieldProps, TableBody,
    CircularProgress, TableFooter, TablePagination, IconButton, Dialog, DialogTitle,
    DialogContent, DialogContentText, DialogActions, Backdrop
} from '@material-ui/core';

import { Delete, Edit, Search, } from '@material-ui/icons';
import { ColorPicker } from 'material-ui-color';
import { DebounceInput } from 'react-debounce-input';

import NavigationBar from '../../../../components/NavigationBar'
import PageContainer from '../../../../components/PageContainer'
import Topbar from '../../../../components/Topbar'
import ICampaign from '../../../../models/ICampaign';
import ColorChip from '../../../../components/ColorChip';
import parseISODate from '../../../../utils/parseISODate';

const DebounceTextField = ({ ...props }: TextFieldProps) => (
    <TextField
        InputProps={{ startAdornment: (
            <InputAdornment position="start">
                <Search htmlColor="#bbb"/>
            </InputAdornment>
        ) }} {...props} />
);

interface Props {
    campaignList: ICampaign[];

    isTableLoading: boolean;

    isPageLoading: boolean;

    count: number;

    onFetchCampaignList(searchTerm: string, skip: number, take: number): Promise<void>;

    onCreateCampaign(title: string, tagColor: string): Promise<void>;

    onUpdateCampaign(campaignId: string, title: string, tagColor: string): Promise<void>

    onDeleteCampaign(campaignId: string): Promise<void>;
}

const CampaignListLayout: React.FC<Props> = ({ campaignList, isTableLoading, count, isPageLoading, onFetchCampaignList, onCreateCampaign, onUpdateCampaign, onDeleteCampaign }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newCampaign, setNewCampaign] = useState({title: '', tagColor: '#6C61B3'});
    const [tableProps, setTableProps] = useState({
        searchTerm: '',
        page: 0,
        rowsPerPage: 10,
        count,
    });
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [updateCampaign, setUpdateCampaign] = useState<ICampaign>({} as ICampaign);
    const [deleteCampaign, setDeleteCampaign] = useState<string>('');
    // const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);
    
    const handleOpenDialog = useCallback(() => {
        setDialogOpen(true);
    }, [])

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
        setNewCampaign({ title: '', tagColor: '' })
    }, []);

    const handleConfirmDialog = useCallback(async () => {
        try {
            setDialogOpen(false);
            await onCreateCampaign(newCampaign.title, newCampaign.tagColor)
           
        } catch (error) {
            setDialogOpen(false);
        }
    }, [onCreateCampaign, newCampaign]);

    const handleConfirmUpdateDialog = useCallback(async () => {
        const {_id, title, tagColor} = updateCampaign;
        try {
            setUpdateDialogOpen(false);
            await onUpdateCampaign(_id, title, tagColor)
            setUpdateCampaign({} as ICampaign);
        } catch (error) {
            setUpdateDialogOpen(false);
            setUpdateCampaign({} as ICampaign);
        }
    }, [updateCampaign, onUpdateCampaign])

    const handleOpenUpdatedDialog = useCallback(async (campaign: ICampaign) => {
        setUpdateDialogOpen(true);
        setUpdateCampaign(campaign);
    }, []);

    const handleCloseUpdatedDialog = useCallback(async () => {
        setUpdateDialogOpen(false);
        setUpdateCampaign({} as ICampaign);
    }, []);

    const handleConfirmDeleteDialog = useCallback(async () => {
        try {
            setDeleteDialogOpen(false);
            await onDeleteCampaign(deleteCampaign)

        } catch (error) {
            setDeleteDialogOpen(false);
        }
    }, [onDeleteCampaign, deleteCampaign]);

    const handleOpenDeleteDialog = useCallback(async (campaingId: string) => {
        setDeleteCampaign(campaingId);
        setDeleteDialogOpen(true);
    }, []);

    const handleCloseDeleteDialog = useCallback(async () => {
        setDeleteCampaign('');
        setDeleteDialogOpen(false);
    }, []);

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

    const onSearchTermChange = async (searchTerm: string) => {
        setTableProps(prev => ({...prev, searchTerm }));

        const {page, rowsPerPage} = tableProps;

        const skip = page * rowsPerPage;

        await onFetchCampaignList(searchTerm, skip, rowsPerPage);

    }

    // const _onSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.checked) {
    //         setSelectedRows(campaignList.map(post => post._id))
    //     } else {
    //         setSelectedRows([]);
    //     }
    // }, [campaignList]);

    const _onItemsPerPageChange = async (rowsPerPage: number) => {
        setTableProps(prev => ({...prev, rowsPerPage }));

        const skip = tableProps.page * rowsPerPage;

        await onFetchCampaignList(tableProps.searchTerm, skip, rowsPerPage);
    }

    const _onPageChange = async (page: number) => {
        setTableProps(prev => ({...prev, page }));

        const skip = page * tableProps.rowsPerPage;

        await onFetchCampaignList(tableProps.searchTerm, skip, tableProps.rowsPerPage);
    }

    return (
        <PageContainer>
            <Topbar title="CAMPANHAS" />
            <Grid container spacing={2} justify="flex-end">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleOpenDialog}>Nova Campanha</Button>
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
                                    <TableCell  colSpan={6}>
                                        <DebounceInput
                                            element={DebounceTextField}
                                            minLength={3}
                                            debounceTimeout={1000}
                                            placeholder="Buscar"
                                            onChange={(e) => onSearchTermChange(e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    {/* <TableCell width={50}>
                                        <Checkbox
                                            color="primary"
                                            checked={(selectedRows.length > 0) ? ((selectedRows.length === campaignList.length) ? true : false): false}
                                            onChange={_onSelectAll}
                                            icon={(selectedRows.length > 0) ? ((selectedRows.length === campaignList.length) ? <CheckBox color="primary"/> : <IndeterminateCheckBox color="primary" /> ) : undefined}
                                        />
                                    </TableCell> */}
                                    <TableCell width={300}>Nome</TableCell>
                                    <TableCell width={210}>Cor da tag</TableCell>
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
                                        <TableBody>
                                            {
                                                campaignList.map(campaign => (
                                                    <TableRow hover key={campaign._id} >
                                                        {/* <TableCell>
                                                            <Checkbox color="primary" checked={_isChecked(campaign._id)} onChange={() => _onSelectRow(campaign._id)}/>
                                                        </TableCell> */}
                                                        <TableCell>{campaign.title}</TableCell>
                                                        <TableCell>
                                                            <ColorChip label={campaign.tagColor} htmlColor={campaign.tagColor}/>
                                                        </TableCell>
                                                        <TableCell>{parseISODate(campaign.updatedAt, 'dd/MM/yyyy HH:mm')}</TableCell>
                                                        <TableCell>
                                                            <IconButton color="primary" onClick={() => handleOpenUpdatedDialog(campaign)} >
                                                                <Edit />
                                                            </IconButton>
                                                            <IconButton color="secondary" onClick={() => handleOpenDeleteDialog(campaign._id)}>
                                                                <Delete />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
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

            <Dialog open={deleteDialogOpen} maxWidth='xs' fullWidth onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Excluir</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deseja apagar o post permanentemente?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseDeleteDialog()} color="primary">Cancelar</Button>
                    <Button onClick={() => handleConfirmDeleteDialog()} variant="contained" color="secondary">Confirmar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialogOpen} maxWidth='xs' fullWidth onClose={handleCloseDialog}>
                <DialogTitle>Nova campanha</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Para criar uma campanha escolha um título e uma cor.
                    </DialogContentText>
                    <TextField label="Título" fullWidth onChange={(e) => setNewCampaign(prev => ({...prev, title: e.target.value}))}/>
                    <br />
                    <br />
                    <br />
                    <ColorPicker
                        onChange={(e) => setNewCampaign(prev => ({...prev, tagColor: e.css?.backgroundColor || prev.tagColor})) }
                        defaultValue="#6C61B3"
                        inputFormats={['hex']}
                        disableAlpha
                        value={newCampaign.tagColor} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
                    <Button onClick={handleConfirmDialog} variant="contained" color="primary">Criar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={updateDialogOpen} maxWidth='xs' fullWidth onClose={handleCloseUpdatedDialog}>
                <DialogTitle>Editar campanha</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Edite sua campanha alterando o nome ou cor.
                    </DialogContentText>
                    <TextField label="Título" fullWidth value={updateCampaign.title} onChange={(e) => setUpdateCampaign(prev => ({...prev, title: e.target.value}))}/>
                    <br />
                    <br />
                    <br />
                    <ColorPicker
                        onChange={(e) => setUpdateCampaign(prev => ({...prev, tagColor: e.css?.backgroundColor || prev.tagColor})) }
                        defaultValue={updateCampaign.tagColor}
                        inputFormats={['hex']}
                        disableAlpha
                        value={updateCampaign.tagColor || '' } />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdatedDialog} color="secondary">Cancelar</Button>
                    <Button onClick={handleConfirmUpdateDialog} variant="contained" color="primary">Salvar</Button>
                </DialogActions>
            </Dialog>

            <Backdrop open={isPageLoading} style={{ zIndex: 50 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </PageContainer>
    )
    
}

export default CampaignListLayout
