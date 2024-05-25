import { GroupModel } from '../models/group.model';

export class SearchService {
  static async searchGroup(text: string) {
    const groups = await GroupModel.searchGroup(text);
    const mapGroups = groups.map((group) => {
      return {
        id: group.id,
        title: group.title,
        metaTitle: group.meta_title,
        members: {
          users: group.member.map((item) => {
            return item.user;
          }),
          count: group._count.member
        },
        createAt: group.create_at
      };
    });
    return mapGroups;
  }
}
