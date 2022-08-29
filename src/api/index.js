// 统一封装接口方法
// 每个方法负责请求一个url地址
// 逻辑页面只要导入这个接口方法就能直接发起请求
// 优点: url地址的统一管理
import axios from '@/utils/request'
import request from '@/utils/request';
// 登录
// 使用axios发起请求,内部会自动把参数转换成JSON字符串发给后台
// 会自动携带请求参数(headers)里面的 Content-Type: 'application/json'
// 使用结构赋值{mobile, code}中 mobile和code 既是变量名又是赋给data中同名变量的值
export const loginAPI = ({mobile, code}) => request ({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: {
    mobile,
    code
  }
})

// 刷新token
export const getNewTokenAPI = () => request ({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${localStorage.getItem ('refresh_token')}`
  }
})

// 获取全部列表
export const getAllChannelsAPI = () => {
  return axios ({
    url: '/v1_0/channels',
  })
}

// 获取用户推荐频道
export const getAllUserChannelAPI = () => request ({
  url: '/v1_0/user/channels',
})

// 更新频道列表(覆盖式)
export const updateChannelAPI = ({channels}) => request ({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels
  }
})

// 删除用户频道
export const deleteChannelAPI = ({channelId}) => request ({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'
})

// 获取文章列表
export const getAllArticleListAPI = ({channel_id, timestamp}) => request ({
  url: '/v1_0/articles',
  params: {
    channel_id,
    timestamp
  }
})

// 不感兴趣的文章
export const dislikeArticleAPI = ({atrId}) => request ({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: {
    target: atrId
  },

})

// 举报文章
export const reportsArticleAPI = ({artId, type}) => request ({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: artId,
    type: type,
    remark: '1111'
  }
})

// 文章详情
export const articleDetailAPI = ({artId}) => request ({
  url: `/v1_0/articles/${artId}`
})

// 获取文章评论列表
export const commentsAPI = ({id, offset = null, limit = 10}) => request ({
  // axios只针对params,如果价值对中的值为null,那么会自动忽略掉这个参数,不会加在url? 后面
  url: '/v1_0/comments',
  params: {
    type: 'a',
    source: id,
    offset,
    limit
  }
})

// 点赞文章
export const likeArticleAPI = ({artId}) => request ({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: artId
  }
})

// 取消点赞文章
export const disLikeArticleAPI = ({artId}) => request ({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})

// 点赞评论
export const likeCommentAPi = ({comId}) => request ({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target: comId
  }
})

// 取消点赞评论
export const disLikeCommentAPI = ({comId}) => request ({
  url: `/v1_0/comment/likings/${comId}`,
  method: 'DELETE'
})

// 发布评论
export const commentSend = ({id, content, art_id = null}) => {
  // axios中,data请求体传参,是不会忽略值为null的参数的,同样会带到后台
  // art_id是一个可选参数,如果穿到后台时发现值为null则说明是对文章进行评论

  // data请求体需要自己处理一下
  const obj = {
    target: id,
    content
  }
  if (art_id !== null) { // 说明有第三个参数，需要携带
    obj.art_id = art_id
  }
  return request ({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}

// 获取搜索列表
export const suggestListAPI = ({keywords}) => request ({
  url: '/v1_0/suggestion',
  params: {
    q: keywords
  }
})

// 关注作者
export const attentionAPI = ({target}) => request ({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target
  }
})

// 取消关注
export const noAttentionAPI = ({target}) => request ({
  url: `/v1_0/user/followings/${target}`,
  method: 'DELETE',
})

// 获取搜索结果
export const searchResultAPI = ({page = 1, per_page = 10, q}) => request ({
  url: '/v1_0/search',
  params: {
    page,
    per_page,
    q
  }
})

// 获取用户基本资料
export const userBaseInfoAPI = () => request ({
  url: '/v1_0/user'
})

// 获取用户个人简介
export const userProfileInfoAPI = () => request ({
  url: '/v1_0/user/profile'
})

// 用户- 更新头像
export const updatePhotoAPI = (formObj) => {
  return request ({
    url: '/v1_0/user/photo',
    method: 'PATCH',  // patch 局部更新
    data: formObj  // formObj是一个 new FormData()表单对象
    // 如果你的请求体内容是表单对象, 浏览器会自动携带请求头Content-Type为multipart/form-data
  })
}

// 用户 - 更新个人简介
export const updateProfilesAPI = (obj) => request ({
  url: '/v1_0/user/profile',
  method: 'PATCH',
  data: obj
})
