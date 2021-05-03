import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import {RouteComponentProps} from "react-router";

import IPost from '../../../../models/IPost'
import PostDetailLayout from './layout'
import PostService from '../../../../services/PostService';
import ICampaign from '../../../../models/ICampaign';
import CampaignService from '../../../../services/CampaignService';
import HashtagService from '../../../../services/HashtagService';
import IHashTags from '../../../../models/IHashTag';

type IState = {
    requestPostDetail: {
        post: IPost;
        isLoading: boolean;
    },
    requestUpdatePost: {
        isLoading: boolean,
    }
    requestDeletePost: {
        isLoading: boolean,
    }
    requestCampaignList: {
        campaignList: ICampaign[];
        isLoading: boolean;
    }
    requestHashtagList: {
        hashtagList: IHashTags[];
        isLoading: boolean;
    }
}

type PathParamsType = {
    id: string,
}

type PropsType = RouteComponentProps<PathParamsType>;

class PostDetailPage extends Component<PropsType, IState> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            requestPostDetail: {
                post: {
                    _id: '',
                    createdAt: '',
                    title: '',
                    updatedAt: '',
                    text: ''
                },
                isLoading: true,
            },
            requestUpdatePost: {
                isLoading: false,
            },
            requestDeletePost: {
                isLoading: false
            },
            requestCampaignList: {
                campaignList: [],
                isLoading: false
            },
            requestHashtagList: {
                hashtagList: [],
                isLoading: false
            }
        }
    }

    componentDidMount = () => {
        this._fecthPostDetail();
        this._onFetchCampaign('');
        this._onFetchHashtagList();
    }
    

    private _fecthPostDetail = async () => {
        const { id } = this.props.match.params;
        try {

            const { data } = await PostService.detail(id);

            this.setState(prev => ({...prev, requestPostDetail: { ...prev.requestPostDetail, isLoading: false, post: data }}));
        } catch (error) {
            this.setState(prev => ({...prev, requestPostDetail: { ...prev.requestPostDetail, isLoading: false }}));
        }
        
    }

    private _onUpdatedPost = async (title: string, text?: string, campaignId?: string | null) => {
        const { id } = this.props.match.params;

        try {
            this.setState(prev => ({...prev, requestUpdatePost: { ...prev.requestUpdatePost, isLoading: true }}));

            await PostService.update({ postId: id, text, campaignId, title }) 

            await this._fecthPostDetail();

            this.setState(prev => ({...prev, requestUpdatePost: { ...prev.requestUpdatePost, isLoading: false }}));
        } catch (error) {
            this.setState(prev => ({...prev, requestUpdatePost: { ...prev.requestUpdatePost, isLoading: false }}));   
        }
    }

    private _onDeletePost = async () => {
        const { id } = this.props.match.params;
        
        try {
            this.setState(prev => ({...prev, requestDeletePost: { ...prev.requestDeletePost, isLoading: true }})); 

            await PostService.deleteOne(id);

            this.props.history.push('/post')

            this.setState(prev => ({...prev, requestDeletePost: { ...prev.requestDeletePost, isLoading: false }}));   
        } catch (error) {
            this.setState(prev => ({...prev, requestDeletePost: { ...prev.requestDeletePost, isLoading: false }}));   
        }
    }

    private _onFetchCampaign = async (searchTerm: string) => {
        try {
            this.setState(prev => ({...prev, requestCampaignList: { ...prev.requestCampaignList, isLoading: true }}));

            const { data: { campaignList } } = await CampaignService.list({ skip: 0, take: 0, searchTerm});
            
            this.setState(prev => ({...prev, requestCampaignList: { ...prev.requestCampaignList, isLoading: false, campaignList }}));
        } catch (error) {
            this.setState(prev => ({...prev, requestCampaignList: { ...prev.requestCampaignList, isLoading: false }}));   
            
        }
    }

    private _onFetchHashtagList = async () => {
        try {
            this.setState(prev => ({...prev, requestHashtagList: { ...prev.requestHashtagList, isLoading: true }}));

            const { data: { hashtagList } } = await HashtagService.list({ skip: 0, take: 0, searchTerm: ''});
            
            this.setState(prev => ({...prev, requestHashtagList: { ...prev.requestHashtagList, isLoading: false, hashtagList }}));
        } catch (error) {
            this.setState(prev => ({...prev, requestHashtagList: { ...prev.requestHashtagList, isLoading: false }}));   
            
        }
    }

    render() {
        const { requestPostDetail, requestDeletePost, requestCampaignList, requestHashtagList, } = this.state;

        return (
            <PostDetailLayout
                isLoading={requestPostDetail.isLoading || requestDeletePost.isLoading || requestCampaignList.isLoading || requestHashtagList.isLoading}
                requestPost={requestPostDetail.post}
                campaignList={requestCampaignList.campaignList}
                hashtagList={requestHashtagList.hashtagList}
                onUpdatedPost={this._onUpdatedPost}
                onDeletePost={this._onDeletePost}
                onFetchCampaign={this._onFetchCampaign}
            />
        )
    }
}

export default withRouter(PostDetailPage);
