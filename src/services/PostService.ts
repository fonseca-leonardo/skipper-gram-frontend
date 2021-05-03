import api from "./api";
import IPost from "../models/IPost";

const routes = {
  list: "/posts/list",
  detail: (id: string) => `/posts/${id}`,
  create: "/posts",
  deleteOne: (id: string) => `/posts/${id}`,
  update: (id: string) => `/posts/${id}`,
};

interface IPostList {
  skip: number;
  take: number;
  searchTerm: string;
}

interface IPostUpdate {
  postId: string;
  text?: string;
  title: string;
  campaignId?: string | null;
}

class PostService {
  public async list({ skip, take, searchTerm }: IPostList) {
    const result = await api.post(routes.list, { skip, take, searchTerm });

    return result.data as { data: { postList: IPost[]; count: number } };
  }

  public async create(title: string) {
    const result = await api.post(routes.create, { title });

    return result.data as { data: IPost };
  }

  public async deleteOne(postId: string) {
    const result = await api.delete(routes.deleteOne(postId));

    return result.data as { data: IPost };
  }

  public async detail(postId: string) {
    const result = await api.get(routes.detail(postId));

    return result.data as { data: IPost };
  }

  public async update({ text, title, campaignId, postId }: IPostUpdate) {
    const result = await api.patch(routes.update(postId), {
      text,
      title,
      campaignId,
    });

    return result.data as { data: IPost };
  }
}

export default new PostService();
