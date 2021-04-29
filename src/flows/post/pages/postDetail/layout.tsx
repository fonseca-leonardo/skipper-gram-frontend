import React, { useState, MouseEvent, ChangeEvent, useCallback, useRef } from 'react';
import styled from 'styled-components';
import {
    AppBar, Grid, Toolbar, Typography,
    Tooltip, TextField, Paper, Button,
    IconButton, Popover, Dialog, DialogTitle, DialogContent,
    DialogActions,
    DialogContentText
} from '@material-ui/core';
import { Close, InsertEmoticon } from '@material-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Picker, BaseEmoji } from 'emoji-mart';
import { useSnackbar } from 'notistack'; 
import 'emoji-mart/css/emoji-mart.css'


import IPost from '../../../../models/IPost';
import ColorChip from '../../../../components/ColorChip';
import IHashTags from '../../../../models/IHashTag';
import NavigationBar from '../../../../components/NavigationBar';

const HashTagPaper = styled(Paper)`
    padding: 12px;
`;

const LegendTextField = styled(Paper)`
    position: relative;
`;

const SelectEmoticon = styled(IconButton)`
    position: absolute;
    right: 0;
    z-index: 5;
    padding: 4px;
`;

const TagsContainer = styled.div`
    display: flex;

    flex-wrap: wrap;

    div {
        margin-right: 8px;
        margin-bottom: 8px;
    }
`;

export default function PostDetailLayout() {
    const [post] = useState<IPost>({
        _id: 2,
        text: 'Algum Post de Pascoa',
        title: '',
        updatedAt: "2021-04-29T14:20:26.518Z",
        createdAt: "2021-04-29T14:20:26.518Z",
        

    });
    const [hashTags] = useState<IHashTags[]>([
        {
            id: 1,
            name: 'Tags usuais',
            color: 'rgb(71, 35, 230)',
            tags: ['#vindi', '#financeiro'],
        },
        {
            id: 2,
            name: 'Tags de pascoa',
            color: 'rgb(35, 113, 230)',
            tags: ['#felizpascoa', '#diadepascoa'],
        },
        {
            id: 3,
            name: 'Natal',
            color: 'rgb(0, 0, 0)',
            tags: ['#feliznatal', '#nataldavindi'],
        }
    ]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const [legend, setLegend] = useState<string>(post.text || '');
    const [cursorPosition, setCursorPosition] = useState<number>(0);


    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleOpenEmojiPicker = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };
    
    const handleCloseEmojiPicker = () => {
        setAnchorEl(null);
    };

    const onConfirmDelete = useCallback(() => {
        setDialogOpen(false);
    }, [])

    const onLegendChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setLegend(event.target.value);
    }   
    
    const emojiSelected = (emoji: BaseEmoji) => {
        setLegend(prev => prev.slice(0,cursorPosition) + emoji.native + prev.slice(cursorPosition));
        setCursorPosition(cursorPosition + emoji.native.length);
    }

    const onSelectHashTag = (tagSelected: IHashTags) => {
        tagSelected.tags.forEach(tag => setLegend(prev => prev + ` ${tag}`));
    }

    const formatLegend = (legendToFormat: string): string => {
        return legendToFormat.replace(/(?:\r\n|\r|\n)/g, "\u2063\n");
    }

    const openEmojiPicker = Boolean(anchorEl);
    const id = openEmojiPicker ? 'emoji-picker' : undefined;

    return (
        <>
            <AppBar variant="elevation" color="primary">
                <Toolbar>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <Typography variant="h6">{post.title}</Typography>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <br />
            <br />
            <br />
            <br />
            <br />
            <Grid container direction="column" spacing={2}>
                <Grid item container justify="flex-end">
                    <Button variant="contained" color="secondary" onClick={() => setDialogOpen(true)}>Excluir Postagem</Button>
                </Grid>
                <Grid item container spacing={4} justify="space-between">
                    <Grid item md={3}>
                        <NavigationBar />
                    </Grid>
                    <Grid item>
                        <Grid container direction="column" spacing={4}>
                            <Grid item>
                                <LegendTextField>
                                    {
                                        openEmojiPicker ? (
                                            <SelectEmoticon aria-describedby={id} onClick={handleCloseEmojiPicker}>
                                                <Close />
                                            </SelectEmoticon>
                                        ) : (
                                            <SelectEmoticon onClick={handleOpenEmojiPicker}>
                                                <InsertEmoticon />
                                            </SelectEmoticon>
                                        )
                                    }
                                    <Popover id={id} anchorEl={anchorEl} open={openEmojiPicker} onClose={handleCloseEmojiPicker}>
                                        <Picker onSelect={emojiSelected}/>
                                    </Popover>
                                    <TextField
                                        focused
                                        id="legend-textarea"
                                        inputRef={textAreaRef}
                                        placeholder="Legenda do post"
                                        onFocus={(e) => setCursorPosition(e.target.selectionStart || 0)}
                                        onClick={(e) => setCursorPosition(textAreaRef?.current?.selectionStart || 0)}
                                        onKeyDown={() => setCursorPosition(textAreaRef?.current?.selectionStart || 0)}
                                        multiline
                                        rows={22}
                                        inputProps={{ style: { width: 450}}}
                                        variant="outlined"
                                        value={legend}
                                        onChange={onLegendChange}
                                    />
                                </LegendTextField>
                            </Grid>
                            <Grid item container justify="flex-end">
                                <CopyToClipboard text={formatLegend(legend)}>
                                    <Button variant="contained" onClick={() => { enqueueSnackbar('Texto formatado copiado com sucesso', { variant: 'success' }) }} color="primary">Copiar legenda formatada</Button>
                                </CopyToClipboard>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container md={4} direction="column" spacing={4}>
                        <Grid item>
                            <HashTagPaper>
                                <Typography variant="subtitle2">Post</Typography>
                                <TextField fullWidth value={post.title} placeholder="Nome"/>
                                <br />
                                <br />
                                <Typography variant="subtitle2">{ post.campaign ? 'Campanha' : 'Criar Campanha' }</Typography>
                                <br />
                                {
                                    post.campaign ? (
                                        <ColorChip htmlColor={post.campaign.color} label={post.campaign.name} onDelete={() => { console.log('AQUI') }} deleteIcon={<Tooltip title="Desvincular campanha"><Close /></Tooltip>} />
                                    ) : (
                                        <>
                                            <Typography variant="subtitle2">Nome</Typography>
                                            <TextField fullWidth placeholder="Nome"/>
                                            <br />
                                            <br />
                                            <Typography variant="subtitle2">Cor</Typography>
                                            <TextField fullWidth placeholder=""/>
                                            <br />
                                            <br />
                                            <Button variant="contained" color="primary">Criar</Button>
                                            <br />
                                        </>
                                    )
                                }
                                <br />
                            </HashTagPaper>
                        </Grid>
                        <Grid item>
                            <HashTagPaper>
                                <Typography variant="subtitle2">Hash Tags</Typography>
                                <br />
                                <TagsContainer>
                                    {
                                        hashTags.map(tag => (
                                            <ColorChip key={tag.id} color="primary" htmlColor={tag.color} label={tag.name} onClick={() => {onSelectHashTag(tag)}}/>
                                        ))
                                    }
                                </TagsContainer>
                            </HashTagPaper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog open={dialogOpen} maxWidth='xs' fullWidth onClose={() => setDialogOpen(false)}>
                <DialogTitle>Excluir</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deseja apagar o post permanentemente?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">Cancelar</Button>
                    <Button onClick={onConfirmDelete} variant="contained" color="secondary">Confirmar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
