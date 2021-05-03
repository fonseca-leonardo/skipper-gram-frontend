import React, { Component } from 'react'
import ICampaign from '../../../../models/ICampaign'
import CampaignService from '../../../../services/CampaignService';
import CampaignListLayout from './layout'

type IState = {
    requestCampaignList: {
        campaignList: ICampaign[];
        count: number;
        isLoading: boolean;
    },
    requestCampaignCreate: {
        isLoading: boolean;
    },
    requestCampaignUpdate: {
        isLoading: boolean;
    },
    requestCampaignDelete: {
        isLoading: boolean;
    },
}
export default class CampaignListPage extends Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            requestCampaignList: {
                campaignList: [],
                count: 0,
                isLoading: true
            },
            requestCampaignCreate: {
                isLoading: false
            },
            requestCampaignUpdate: {
                isLoading: false
            },
            requestCampaignDelete: {
                isLoading: false
            },
        };
    }

    componentDidMount = async () => {
        await this._onFetchCampaignList('', 0, 10);
    }

    _onFetchCampaignList = async (searchTerm: string, skip: number, take: number) => {
        try {
            this.setState(prev => ({...prev, requestCampaignList: {...prev.requestCampaignList, isLoading: true} }));

            const {data: { campaignList, count }} = await CampaignService.list({ searchTerm, skip, take });

            this.setState(prev => ({...prev, requestCampaignList: {...prev.requestCampaignList, campaignList, isLoading: false, count} }));

        } catch (error) {
            this.setState(prev => ({...prev, requestCampaignList: {...prev.requestCampaignList, isLoading: false} }));
        }
    }

    _onCreateCampaign = async (title: string, tagColor: string) => {
        try {
            this.setState(prev => ({...prev, requestCampaignCreate: {...prev.requestCampaignCreate, isLoading: true} }));

            await CampaignService.create(title, tagColor);

            await this._onFetchCampaignList('', 0, 10);

            this.setState(prev => ({...prev, requestCampaignCreate: {...prev.requestCampaignCreate, isLoading: false} }));

        } catch (error) {
            this.setState(prev => ({...prev, requestCampaignCreate: {...prev.requestCampaignCreate, isLoading: false} }));
        }
    }

    _onUpdateCampaign = async (campaignId: string, title: string, tagColor: string) => {
        try {
            this.setState(prev => ({...prev, requestCampaignUpdate: {...prev.requestCampaignUpdate, isLoading: true} }));

            await CampaignService.update(campaignId, title, tagColor);

            await this._onFetchCampaignList('', 0, 10);

            this.setState(prev => ({...prev, requestCampaignUpdate: {...prev.requestCampaignUpdate, isLoading: false} }));
        } catch (error) {
            this.setState(prev => ({...prev, requestCampaignUpdate: {...prev.requestCampaignUpdate, isLoading: false} }));
        }
    }

    _onDeleteCampaign = async (campaignId: string) => {
        try {
            this.setState(prev => ({...prev, requestCampaignDelete: {...prev.requestCampaignDelete, isLoading: true} }));

            await CampaignService.delete(campaignId);

            await this._onFetchCampaignList('', 0, 10);

            this.setState(prev => ({...prev, requestCampaignDelete: {...prev.requestCampaignDelete, isLoading: false} }));      
        } catch (error) {
            this.setState(prev => ({...prev, requestCampaignDelete: {...prev.requestCampaignDelete, isLoading: false} }));
            
        }
    }

    render() {
        const { requestCampaignList, requestCampaignUpdate, requestCampaignDelete, requestCampaignCreate } = this.state;

        return (
            <CampaignListLayout
                isTableLoading={requestCampaignList.isLoading}
                isPageLoading={requestCampaignUpdate.isLoading || requestCampaignDelete.isLoading || requestCampaignCreate.isLoading}
                count={requestCampaignList.count}
                campaignList={requestCampaignList.campaignList}
                onFetchCampaignList={this._onFetchCampaignList}
                onCreateCampaign={this._onCreateCampaign}
                onUpdateCampaign={this._onUpdateCampaign}
                onDeleteCampaign={this._onDeleteCampaign}
            />
        )
    }
}
