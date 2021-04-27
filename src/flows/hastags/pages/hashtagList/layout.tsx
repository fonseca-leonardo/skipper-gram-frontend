import React, { useState, useCallback } from 'react';

import { Grid, Button, TableContainer,
    Paper, Table, TableHead, TableRow, TableCell, TextField, InputAdornment,
    TextFieldProps, TableBody, CircularProgress, IconButton, TableFooter, TablePagination,
    Checkbox,
    Hidden,
} from '@material-ui/core';

import { Delete, Edit, Search, IndeterminateCheckBox, CheckBox } from '@material-ui/icons';
import { DebounceInput } from 'react-debounce-input';

import NavigationBar from '../../../../components/NavigationBar';
import IHashTags from '../../../../models/IHashTag';
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
    hashTagList: IHashTags[];
    isLoading: boolean;
}

export default function HashtagListLayout({ hashTagList, isLoading }: Props) {
    const [tableProps, setTableProps] = useState({
        searchTerm: '',
        page: 1,
        rowsPerPage: 10,
        count: 30
    });

    const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);

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
            setSelectedRows(hashTagList.map(post => post.id))
        } else {
            setSelectedRows([]);
        }
    }, [hashTagList]);

    return (
        <>
            <Topbar title="HASHTAGS"/>
            <br />
            <br />
            <br />
            <br />
            <br />
            <Grid container spacing={2} justify="flex-end" >
                <Grid item sm={12} xs={12} md={2} >
                    <Button fullWidth variant="contained" color="primary" onClick={() => {}}>Nova Hashtag</Button>
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
                                            checked={(selectedRows.length > 0) ? ((selectedRows.length === hashTagList.length) ? true : false): false}
                                            onChange={_onSelectAll}
                                            icon={(selectedRows.length > 0) ? ((selectedRows.length === hashTagList.length) ? <CheckBox color="primary"/> : <IndeterminateCheckBox color="primary" /> ) : undefined}
                                        />
                                    </TableCell>
                                    <TableCell width={50}>ID</TableCell>
                                    <TableCell width={200}>Nome</TableCell>
                                    <TableCell width={350}>Tags</TableCell>
                                    <TableCell width={140}>Ações</TableCell>
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
                                            {hashTagList.map(hashTag => (
                                                <TableRow hover key={hashTag.id}>
                                                    <TableCell>
                                                        <Checkbox color="primary" checked={_isChecked(hashTag.id)} onChange={() => _onSelectRow(hashTag.id)}/>
                                                    </TableCell>
                                                    <TableCell>{hashTag.id}</TableCell>
                                                    <TableCell>{hashTag.name}</TableCell>
                                                    <TableCell>{hashTag.tags}</TableCell>
                                                    <TableCell width="140px" scope="row">
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={6}>
                                                                <IconButton color="primary">
                                                                    <Edit />
                                                                </IconButton>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <IconButton color="secondary">
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
        </>
    )
}
