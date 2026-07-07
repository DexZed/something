import { Prisma } from "../../generated/prisma/client";




type Query = Prisma.UserFindManyArgs;
type Builder = (q: Query) => Query;

export const pipe = (...fns: Function[]) => (val: any) => fns.reduce((prev, fn) => fn(prev), val);


export const where = (where: Query["where"]): Builder =>
    q => ({ ...q, where });

export const skip = (skip: number): Builder =>
    q => ({ ...q, skip });

 export const take = (take: number): Builder =>
    q => ({ ...q, take });

export const orderBy = (orderBy: Query["orderBy"]): Builder =>
    q => ({ ...q, orderBy });

export const include = (include: Query["include"]): Builder =>
    q => ({ ...q, include });
