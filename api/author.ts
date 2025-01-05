import request from '../lib/request'

export function getAuthorStatus() {
    return request.get('/author/status');
}

export function register(params: any) {
    return request.post('/author/register', params);
}

export function listBooks(params: any) {
    return request.get('/author/books', { params });
}

export function publishBook(params: any) {
    return request.post('/author/book', params);
}

export function listChapters(bookId: any, params: any) {
    return request.get(`/author/book/chapters/${bookId}`, { params });
}

export function publishChapter(bookId: any, params: any) {
    return request.post(`/author/book/chapter/${bookId}`, params);
}

export function deleteChapter(id: any) {
    return request.delete(`/author/book/chapter/${id}`);
}

export function getChapter(id: any) {
    return request.get(`/author/book/chapter/${id}`);
}

export function updateChapter(id: any, params: any) {
    return request.put(`/author/book/chapter/${id}`,params);
}