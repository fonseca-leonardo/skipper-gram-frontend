import api from "./api";
import IPost from "../models/IPost";

const routes = {
  list: "/posts/list",
};

interface IPostList {
  skip: number;
  take: number;
  searchTerm: string;
}

class PostService {
  public async list({ skip, take, searchTerm }: IPostList) {
    const result = await api.post(routes.list, { skip, take, searchTerm });

    return result.data as { data: { postList: IPost[] } };
  }
}

export default new PostService();
