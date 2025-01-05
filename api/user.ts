import request from '@/lib/request'

export function register(params: any) {
    return request.post('/front/user/register', params);
}

export function login(params: any) {
    return request.post('/front/user/login', params);
}

export function submitFeedBack(params: any) {
    return request.post('/front/user/feedback', params);
}

export function comment(params: any) {
    return request.post('/front/user/comment',params);
}

export function deleteComment(id: string) {
    return request.delete(`/front/user/comment/${id}`);
}

export function updateComment(id: string, content: string) {
    return request.putForm(`/front/user/comment/${id}`, content);
}

export function getUserinfo() {
    return request.get('/front/user');
}

export function updateUserInfo(userInfo: any) {
    return request.put('/front/user', userInfo);
}

export function listComments(params: any) {
    return request.get('/front/user/comments', { params });
}