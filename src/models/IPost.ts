import ICampaign from "./ICampaign";

export default interface IPost {
  _id: number;

  title: string;

  campaign?: ICampaign;

  text?: string;

  updatedAt: string;

  createdAt: string;
}
