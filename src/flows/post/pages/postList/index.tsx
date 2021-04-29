import React, { Component } from 'react';

import IPost from '../../../../models/IPost';
import PostService from '../../../../services/PostService';

import PostListLayout from './layout';

type IState = {
    requestPostList: {
        postList: IPost[];
        isLoading: boolean;
    }
}

export default class PostListPage extends Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            requestPostList: {
                postList: [],
                isLoading: true
            }
        }
    }

    componentDidMount = () => {
        this._onFetchPostList('', 0, 10)
    }

    private _onFetchPostList = async (searchTerm: string, skip: number, take: number) => {
        try {
            this.setState(prev => ({...prev, requestPostList: {...prev.requestPostList, isLoading: true} }));

            const {data: { postList }} = await PostService.list({ searchTerm, skip, take });

            this.setState(prev => ({...prev, requestPostList: {...prev.requestPostList, postList, isLoading: false} }));
        } catch (error) {
            this.setState(prev => ({...prev, requestPostList: {...prev.requestPostList, isLoading: false} }));
        }
    }

    render() {
        const { requestPostList } = this.state;
        return (
            <PostListLayout postList={requestPostList.postList} isLoading={requestPostList.isLoading} />
        )
    }
}
