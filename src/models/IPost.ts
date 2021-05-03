import ICampaign from "./ICampaign";

export default interface IPost {
  _id: string;

  title: string;

  campaign?: ICampaign;

  text?: string;

  updatedAt: string;

  createdAt: string;
}
