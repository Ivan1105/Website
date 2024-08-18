interface PageParams<T> {
    params?: T;
    page: number;
    pageSize: number;
}

interface PageResult<T> {
    total: number;
    list: T[];
}