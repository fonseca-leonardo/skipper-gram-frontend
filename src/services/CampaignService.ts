import ICampaign from "../models/ICampaign";
import api from "./api";

const routes = {
  list: "/campaign/list",
  create: "/campaign",
  update: (id: string) => "/campaign/" + id,
  delete: (id: string) => "/campaign/" + id,
};

interface ICampaignList {
  skip: number;
  take: number;
  searchTerm: string;
}

class CampaignService {
  public async list({ skip, take, searchTerm }: ICampaignList) {
    const result = await api.post(routes.list, { skip, take, searchTerm });

    return result.data as {
      data: { campaignList: ICampaign[]; count: number };
    };
  }

  public async create(title: string, tagColor: string) {
    const result = await api.post(routes.create, { title, tagColor });

    return result.data as {
      data: {
        _id: string;
        createdAt: string;
        title: string;
        updatedAt: string;
        tagColor: string;
      };
    };
  }

  public async update(campaignId: string, title: string, tagColor: string) {
    await api.patch(routes.update(campaignId), {
      title,
      tagColor,
    });
  }

  public async delete(campaignId: string) {
    await api.delete(routes.delete(campaignId));
  }
}

export default new CampaignService();
