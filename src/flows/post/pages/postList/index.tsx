import React, { Component } from 'react';
import IPost from '../../../../models/IPost';
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
                postList: [
                    {
                        id: 1,
                        name: 'Post de Bem-vindo',
                        campaign: {
                            id: 1,
                            name: 'Primeiro',
                            color: 'blue',
                        },
                        message: '',
                        lastUpdate: '2021-02-09T19:21:27.000Z',
                      },
                      {
                        id: 2,
                        name: 'Algum Post de Pascoa',
                        campaign: {
                            id: 2,
                            name: 'Campanha Páscoa',
                            color: 'green',
                        },
                        message: '',
                        lastUpdate: '2021-02-09T19:21:27.000Z',   
                  
                      },
                      {
                        id: 3,
                        name: 'Post com tema de Natal',
                        lastUpdate: '2021-02-09T19:21:27.000Z',
                        message: '',
                      }
                ],
                isLoading: false
            }
        }
    }
    render() {
        const { requestPostList } = this.state;
        return (
            <PostListLayout postList={requestPostList.postList} isLoading={requestPostList.isLoading} />
        )
    }
}
