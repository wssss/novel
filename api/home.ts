import request from '../lib/request'

export function listHomeBooks() {
    return request.get('/front/home/books');
}


export function listHomeFriendLinks() {
    return request.get('/front/home/friend_Link/list');
}

