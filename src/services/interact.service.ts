import { interact_type } from '@prisma/client';

interface Interaction {
  type: interact_type | null;
}

export const categorizeAndCount = (arr: Interaction[]) => {
  return arr.reduce((acc: Record<string, number>, obj: Interaction) => {
    if (obj && obj.type) {
      const type = obj.type;
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {});
};
