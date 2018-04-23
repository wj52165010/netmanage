import * as types from '../mutation-types'

const state={
    content:'主页'
}

const mutations={
    [types.UPDATE_TO_MAIN_CONTENT](state,content){
        state.content=content;
    }
}



export default{
    state,
    mutations
}