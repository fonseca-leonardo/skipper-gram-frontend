import React, { Component } from 'react';

import IPost from '../../../../models/IPost';
import PostService from '../../../../services/PostService';

import PostListLayout from './layout';

type IState = {
    requestPostList: {
        postList: IPost[];
        count: number;
        isLoading: boolean;
    },
    requestCreatePost: {
        isLoading: boolean,
    }
    requestDeletePost: {
        isLoading: boolean,
    }
}

export default class PostListPage extends Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            requestPostList: {
                postList: [],
                count: 10,
                isLoading: true
            },
            requestCreatePost: {
                isLoading: false,
            },
            requestDeletePost: {
                isLoading: false,
            }
        }
    }

    componentDidMount = async () => {
        await this._onFetchPostList('', 0, 10);
    }

    private _onFetchPostList = async (searchTerm: string, skip: number, take: number) => {
        try {
            this.setState(prev => ({...prev, requestPostList: {...prev.requestPostList, isLoading: true} }));

            const {data: { postList, count }} = await PostService.list({ searchTerm, skip, take });

            this.setState(prev => ({...prev, requestPostList: {...prev.requestPostList, postList, isLoading: false, count} }));

        } catch (error) {
            this.setState(prev => ({...prev, requestPostList: {...prev.requestPostList, isLoading: false} }));
        }
    }

    private _onCreatePost = async (title: string): Promise<string> => {
        try {
            this.setState(prev => ({...prev, requestCreatePost: { ...prev.requestCreatePost, isLoading: true }}));
            
            const { data: { _id } } = await PostService.create(title);

            this.setState(prev => ({...prev, requestCreatePost: { ...prev.requestCreatePost, isLoading: false }}));

            return _id;
        } catch (error) {
            this.setState(prev => ({...prev, requestCreatePost: { ...prev.requestCreatePost, isLoading: false }}));
            return '';
        }
    }

    private _onDeleteSinglePost = async (postId: string): Promise<void> => {
        try {
            this.setState(prev => ({...prev, requestDeletePost: { ...prev.requestDeletePost, isLoading: true }}));
            
            await PostService.deleteOne(postId);

            this.setState(prev => ({...prev, requestDeletePost: { ...prev.requestDeletePost, isLoading: false }}));
        } catch (error) {
            this.setState(prev => ({...prev, requestDeletePost: { ...prev.requestDeletePost, isLoading: false }}));
        }
    }

    render() {
        const { requestPostList, requestCreatePost } = this.state;
        return (
            <PostListLayout
                postList={requestPostList.postList}
                count={requestPostList.count}
                isTableLoading={requestPostList.isLoading}
                isPageLoading={requestCreatePost.isLoading}
                onCreatePost={this._onCreatePost}
                onFetchPostList={this._onFetchPostList}
                onDeleteSinglePost={this._onDeleteSinglePost}
            />
        )
    }
}
