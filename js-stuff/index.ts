let query: Record<string, unknown>;

const pipe = (...fns: Function[]) => (val: any) => fns.reduce((prev, fn) => fn(prev), val);

const where = (predicate: Record<string, unknown>) => (query: Record<string, unknown>) => ({ ...query, where: predicate })

const skip = (num: number) => (query: Record<string, unknown>) => ({ ...query, skip: num });

const orderBy = (criteria: Object) => (query: Record<string, unknown>) => ({ ...query, orderBy: { ...criteria } });

const create = (data: Record<string, string>) => ({ data: data })

const omit = (exclude: Record<string, boolean>) => (query: Record<string, unknown>) => ({ ...query, omit: exclude })

const include = (include: Record<string, boolean>) => (query: Record<string, unknown>) => ({ ...query, include: { ...include } })

const filterBy = (conditions: Record<string, unknown>[]) => (query: Record<string, unknown>) => ({ ...query, where: { AND: [...conditions], }, });

const searchBy = (searchTerms: Record<string, unknown>[]) => (query: Record<string, unknown>) => ({ ...query, where: { OR: [...searchTerms], }, });

// const dynamicPrismaQuery = pipe(
//     () => create({ name: "name", age: "20" }),

// )({});
// console.log(dynamicPrismaQuery);

// const find = pipe(
//     where({ name: "name", age: 20 }),
//     omit({ password: true, emai: true }),
//     include({ post: true, comment: true }),
//     orderBy({ age: "asc" }),
//     skip(10),
// )({});
// console.log(find);
const s = [{ title: { contains: "Ronaldo", mode: "insensitive" } }, { content: { contains: "Messi", mode: "sensitive" } }]
const search = pipe(
    searchBy(s)
)({});

console.log(search);