export function isActive(query: URLSearchParams, key: string, id: string) {
  return query.getAll(key).includes(id);
}

export function queryToggle(query: URLSearchParams, key: string, id: string) {
  const q = new URLSearchParams(query);
  if (isActive(q, key, id)) {
    q.delete(key, id);
  } else {
    q.append(key, id);
  }
  return q;
}
