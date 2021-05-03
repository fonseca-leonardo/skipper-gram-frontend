import React, { useState, MouseEvent, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
    Grid, Typography,
    Tooltip, TextField, Paper, Button,
    IconButton, Popover, Dialog, DialogTitle, DialogContent,
    DialogActions,
    DialogContentText,
    Backdrop,
    CircularProgress
} from '@material-ui/core';
import { Close, InsertEmoticon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Picker, BaseEmoji } from 'emoji-mart';
import { useSnackbar } from 'notistack'; 
import { DebounceInput } from 'react-debounce-input';


import 'emoji-mart/css/emoji-mart.css'


import IPost from '../../../../models/IPost';
import ColorChip from '../../../../components/ColorChip';
import IHashTags from '../../../../models/IHashTag';
import NavigationBar from '../../../../components/NavigationBar';
import PageContainer from '../../../../components/PageContainer';
import Topbar from '../../../../components/Topbar';
import ICampaign from '../../../../models/ICampaign';

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

interface Props {
    requestPost: IPost;

    isLoading: boolean;

    campaignList: ICampaign[];

    hashtagList: IHashTags[];

    onUpdatedPost(title: string, text?: string, campaignId?: string | null): Promise<void>;

    onDeletePost(): Promise<void>;

    onFetchCampaign(searchTerm: string): Promise<void>;
}

const PostDetailLayout: React.FC<Props> = ({ requestPost, isLoading, campaignList, hashtagList, onUpdatedPost, onDeletePost }) => {
    const [post, setPost] = useState<IPost>(requestPost);

    const [dialogOpen, setDialogOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const textAreaRef = useRef<HTMLInputElement | null>(null);

    const [legend, setLegend] = useState<string>(post.text || "");
    const [cursorPosition, setCursorPosition] = useState<number>(0);


    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    useEffect(() => { 
        setPost(requestPost);
        setLegend(requestPost.text || "");
    }, [requestPost]);
    

    const handleOpenEmojiPicker = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };
    
    const handleCloseEmojiPicker = () => {
        setAnchorEl(null);
    };

    const onConfirmDelete = useCallback(async () => {
        await onDeletePost();
        
        setDialogOpen(false);
    }, [onDeletePost])

    const onLegendChange = async (value: string) => {
        setLegend(value);
        
        await onPostChange(value, 'text');
    }
    
    const emojiSelected = async (emoji: BaseEmoji) => {
        const text = legend.slice(0,cursorPosition) + emoji.native + legend.slice(cursorPosition);
        setLegend(text);
        setCursorPosition(cursorPosition + emoji.native.length);

        await onPostChange(text, 'text');
    }

    const onSelectHashTag = async (tagSelected: IHashTags) => {
        let tagsText = '';
        tagSelected.tags.forEach(tag => { tagsText = tagsText + ` ${tag}` });
        const updatedLegend = legend + tagsText;

        setLegend(updatedLegend);

        await onPostChange(updatedLegend, 'text');
    }

    const formatLegend = (legendToFormat: string): string => {
        return legendToFormat.replace(/(?:\r\n|\r|\n)/g, "\u2063\n");
    }

    const onPostChange = async (data: string, key: keyof IPost) => {
        const updatePost = {...post, [key]: data };
        setPost(updatePost);

        await onUpdatedPost(updatePost.title, updatePost.text, updatePost.campaign?._id);
    }

    const onDetachCampaign = async () => {
        await onUpdatedPost(post.title, post.text, null);
    }

    const onAttachCampaign = async (campaignId: string) => {
        await onUpdatedPost(post.title, post.text, campaignId);
    }

    const openEmojiPicker = Boolean(anchorEl);
    const id = openEmojiPicker ? 'emoji-picker' : undefined;

    return (
        <PageContainer>
            <Topbar title={post.title} />

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
                                    <DebounceInput
                                        element={TextField}
                                        minLength={3}
                                        debounceTimeout={1000}
                                        focused
                                        id="legend-textarea"
                                        inputRef={textAreaRef}
                                        placeholder="Legenda do post"
                                        onFocus={(e: any) => setCursorPosition(e.target.selectionStart || 0)}
                                        onClick={(e: any) => setCursorPosition(e.target.selectionStart || 0)}
                                        onKeyUp={() => {
                                            const ref = textAreaRef as any;
                                            setCursorPosition(ref.current?.firstChild?.firstChild?.selectionStart || 0)
                                        }}
                                        multiline
                                        rows={22}
                                        inputProps={{ style: { width: 450 }}}
                                        variant="outlined"
                                        value={legend}
                                        onChange={(e) => onLegendChange(e.target.value)}
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
                                <DebounceInput
                                    element={TextField}
                                    minLength={3}
                                    debounceTimeout={1000}
                                    onChange={(e) => onPostChange(e.target.value, 'title')}
                                    value={post.title}
                                    placeholder="Nome"
                                    fullWidth
                                />
                                <br />
                                <br />
                                <Typography variant="subtitle2">
                                    { post.campaign ? 'Campanha' : 'Vincule a uma campanha' }
                                </Typography>
                                
                                {
                                    post.campaign ? (
                                        <ColorChip htmlColor={post.campaign.tagColor} label={post.campaign.title} onDelete={onDetachCampaign} deleteIcon={<Tooltip title="Desvincular campanha"><Close /></Tooltip>} />
                                    ) : (
                                        <>
                                            <Autocomplete
                                                options={campaignList}
                                                getOptionLabel={(option: ICampaign) => option.title }
                                                renderInput={(params) => <TextField {...params}/>}
                                                onChange={(_, value) => onAttachCampaign(value?._id || '')}
                                            />
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
                                        hashtagList.map(tag => (
                                            <ColorChip key={tag._id} color="primary" htmlColor={tag.tagColor} label={tag.name} onClick={() => {onSelectHashTag(tag)}}/>
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
            <Backdrop open={isLoading} style={{ zIndex: 5 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </PageContainer>
    )
}

export default PostDetailLayout;