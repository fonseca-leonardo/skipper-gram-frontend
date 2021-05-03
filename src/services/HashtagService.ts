import IHashTags from "../models/IHashTag";
import api from "./api";

const routes = {
  list: "/hashtags/list",
  create: "/hashtags",
  delete: (id: string) => "/hashtags/" + id,
  update: (id: string) => "/hashtags/" + id,
};

interface IHashtagList {
  skip: number;
  take: number;
  searchTerm: string;
}

interface IHashtagRequest {
  tags: string[];

  tagColor: string;

  name: string;
}

class HashtagService {
  public async list({ searchTerm, skip, take }: IHashtagList) {
    const result = await api.post(routes.list, { skip, take, searchTerm });

    return result.data as { data: { hashtagList: IHashTags[]; count: number } };
  }

  public async create(data: IHashtagRequest) {
    const result = await api.post(routes.create, data);

    return result.data as IHashTags;
  }

  public async delete(hashtagId: string) {
    await api.delete(routes.delete(hashtagId));
  }

  public async update({ _id, name, tags, tagColor }: IHashTags) {
    await api.patch(routes.delete(_id), { name, tags, tagColor });
  }
}

export default new HashtagService();
