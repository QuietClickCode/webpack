
import * as types from '../mutation-types';

let state = {
    /*
     * test
     * @type {String}
     * */
    test: 'test'
};

let actions = {
    /**
     * test
     * @param {Function} commit
     */
    async test ({commit}) {
        let res = await test();
        if (res.code === ERR_OK) {
            commit(types.TEST, {test: 'test'});
        }
        else {
            // 错误处理
        }
    }
};

let mutations = {
    [types.TEST] (state, {test}) {
        state.test = test;
    }
};

let getters = {
    test () {
        return state.test;
    }
};

export default {
    namespaced: true,
    actions,
    mutations,
    getters,
    state
};
