const getSearchParams = async <T extends Record<string, string | string[]>>(props: {
    searchParams: Promise<T>
}): Promise<{ [K in keyof T]: string[] }> => {
    const searchParams = await props.searchParams
    return Object.entries(searchParams).reduce<{ [K in keyof T]: string[] }>(
        (pre, [key, value]) => {
            pre[key as keyof T] = (Array.isArray(value) ? value.join(",") : value).split(",")
            return pre
        },
        {} as { [K in keyof T]: string[] }
    )
}
export const getQuery = async <T extends Record<string, string | string[]>>(props: { searchParams: Promise<T> }) => {
    const searchParams = await getSearchParams(props)
    return Object.entries(searchParams).reduce((query, [key, values]) => {
        values.forEach((value) => {
            query.append(key, value)
        })
        return query
    }, new URLSearchParams())
}
export function isActive(query: URLSearchParams, key: string, id: string) {
    return query.getAll(key).includes(id)
}

export function queryToggle(query: URLSearchParams, key: string, id: string) {
    const q = new URLSearchParams(query)
    if (isActive(q, key, id)) {
        q.delete(key, id)
    } else {
        q.append(key, id)
    }
    return q
}
