import React from 'react';
import {  useTheme } from '@material-ui/core/styles';

import CampaignIcon from '../assets/Icons/Campaign';
import HashTag from '../assets/Icons/HashTag';

import { FormatListBulleted } from '@material-ui/icons';
import { PostDetailPage, PostListPage } from '../flows/post';
import { HashtagListPage } from '../flows/hastags';


interface IconPath {
    path: string;
    currentPath: string;
}


export const PrivateRoutes = [
    {
        path: '/post',
        title: 'Lista de posts',
        Icon: ({ path, currentPath }: IconPath) =>  {
            const { palette } = useTheme();
 
            return <FormatListBulleted htmlColor={(path === currentPath ) ? palette.primary.main : palette.text.primary}  />
        },
        page: PostListPage,
        listable: true,
        exact: true,
    },
    {
        path: '/post/:id',
        page: PostDetailPage,
        listable: false,
        exact: false,
    },
    {
        path: '/campanha',
        title: 'Suas Campanhas',
        Icon: ({ path, currentPath }: IconPath) => <CampaignIcon height={24} width={24} color={(path === currentPath ) ? 'primary' : undefined} />,
        page: PostListPage,
        listable: true,
        exact: false,


    },
    {
        path:'/hashtag',
        title: 'Suas Tags',
        Icon: ({ path, currentPath }: IconPath) => <HashTag height={24} width={24} color={(path === currentPath ) ? 'primary' : undefined} />,
        page: HashtagListPage,
        listable: true,
        exact: false,
    }
];