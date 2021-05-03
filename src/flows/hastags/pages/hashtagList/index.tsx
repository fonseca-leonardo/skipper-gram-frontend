import React, { Component } from 'react';
import IHashTags from '../../../../models/IHashTag';
import HashtagService from '../../../../services/HashtagService';
import HashtagListLayout from './layout'

type IState = {
    requestHashtagList: {
        hashtagList: IHashTags[];
        isLoading: boolean;
        count: number;
    };
    requestHashtagCreate: {
        isLoading: boolean;
    };
    requestHashtagDelete: {
        isLoading: boolean;
    };
    requestHashtagUpdate: {
        isLoading: boolean;
    }
}

interface IRequestHashtag {
    name: string;
    tagColor: string;
    tags: string[];
}

export default class HashtagListPage extends Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            requestHashtagList: {
                hashtagList: [],
                count: 0,
                isLoading: true
            },
            requestHashtagCreate: {
                isLoading: false
            },
            requestHashtagDelete: {
                isLoading: false,
            },
            requestHashtagUpdate: {
                isLoading: false,
            }
        }
    }

    componentDidMount = () => {
        this._onFetchHashtagList('', 0, 0);
    }

    _onFetchHashtagList = async (searchTerm: string, skip: number, take: number) => {
        try {
            this.setState(prev => ({...prev, requestHashtagList: {...prev.requestHashtagList, isLoading: true } }));

            const {data: { hashtagList, count }} = await HashtagService.list({ searchTerm, skip, take });

            this.setState(prev => ({...prev, requestHashtagList: {...prev.requestHashtagList, hashtagList, count, isLoading: false} }));      
        } catch (error) {
            this.setState(prev => ({...prev, requestHashtagList: {...prev.requestHashtagList, isLoading: false} }));
        }
    }

    _onCreateHashtag = async (data: IRequestHashtag) => {
        try {
            this.setState(prev => ({...prev, requestHashtagCreate: {...prev.requestHashtagCreate, isLoading: true} }));

            await HashtagService.create(data);
            this._onFetchHashtagList('', 0, 0);

            this.setState(prev => ({...prev, requestHashtagCreate: {...prev.requestHashtagCreate, isLoading: false} }));
        } catch (error) {
            this.setState(prev => ({...prev, requestHashtagCreate: {...prev.requestHashtagCreate, isLoading: false} }));
        }
    }

    _onDeleteHashtag = async (hashtagId: string) => {
        try {
            this.setState(prev => ({...prev, requestHashtagDelete: {...prev.requestHashtagDelete, isLoading: true} }));

            await HashtagService.delete(hashtagId);

            this.setState(prev => ({...prev, requestHashtagDelete: {...prev.requestHashtagDelete, isLoading: false} }));
        } catch (error) {
            this.setState(prev => ({...prev, requestHashtagDelete: {...prev.requestHashtagDelete, isLoading: false} }));
        }
    }

    _onUpdateHashtag = async (hashtag: IHashTags) => {
        try {
            this.setState(prev => ({...prev, requestHashtagUpdate: {...prev.requestHashtagUpdate, isLoading: true} }));

            await HashtagService.update(hashtag);

            await this._onFetchHashtagList('', 0, 10);

            this.setState(prev => ({...prev, requestHashtagUpdate: {...prev.requestHashtagUpdate, isLoading: false} }));
        } catch (error) {
            this.setState(prev => ({...prev, requestHashtagUpdate: {...prev.requestHashtagUpdate, isLoading: false} }));
        }
    }

    render() {
        const { requestHashtagList, requestHashtagCreate, requestHashtagUpdate } = this.state;
        return (
            <HashtagListLayout
                isPageLoading={requestHashtagCreate.isLoading}
                isTableLoading={requestHashtagList.isLoading || requestHashtagUpdate.isLoading}
                hashTagList={requestHashtagList.hashtagList}
                count={requestHashtagList.count}
                onFetchHashtagList={this._onFetchHashtagList}
                onCreateHashtag={this._onCreateHashtag}
                onDeleteHashtag={this._onDeleteHashtag}
                onUpdateHashtag={this._onUpdateHashtag}
            />
        )
    }
}
