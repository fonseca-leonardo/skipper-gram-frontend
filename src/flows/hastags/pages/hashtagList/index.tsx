import React, { Component } from 'react';
import IHashTags from '../../../../models/IHashTag';
import HashtagListLayout from './layout'

type IState = {
    requestHashtagList: {
        hashTagList: IHashTags[];
        isLoading: boolean;
    }
}

export default class HashtagListPage extends Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            requestHashtagList: {
                hashTagList: [
                    {
                        id: 1,
                        color: '#123456',
                        name: 'tags padrão',
                        tags: ['#empresa', '#feliz', '#trabalho']
                    },
                    {
                        id: 2,
                        color: '#123456',
                        name: 'tags padrão',
                        tags: ['#empresa', '#feliz', '#trabalho']
                    }
                ],
                isLoading: false
            }
        }
    }

    render() {
        const { requestHashtagList } = this.state;
        return (
            <HashtagListLayout
                isLoading={requestHashtagList.isLoading}
                hashTagList={requestHashtagList.hashTagList}
            />
        )
    }
}
