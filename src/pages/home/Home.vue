<template>
    <div class="hello">
        <img src="../../assets/logo.png">
        <h1 class="gray--text">IVue Home</h1>
        {{_test}}
        <ul>
            <li>
                <IvueButton href="https://github.com/qq282126990/ivue-ui">IVue Github</IvueButton>
            </li>
            <li>
                <IvueButton href="https://lovevuerk.com">IVue 官网</IvueButton>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex';


export default {
    name: 'hello',
    async asyncData () {
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 500);
        });
    },
    data () {
        return {
            _test: ''
        }
    },
    computed: {
        ...mapState('test', {
            _test: 'test',
        })
    },
    data () {
        return {
            msg: 'Welcome to Your Vue.js App'
        };
    }
};
</script>

<style scoped>
h1 {
  margin-top: 50px;
  font-size: 46px;
  font-weight: 500;
}

h4 {
  margin-bottom: 50px;
}

ul {
  padding: 0;
}

li {
  list-style: none;
  display: inline-block;
}

a {
  display: inline-block;
  line-height: 45px;
  width: 150px;
  height: 45px;
  font-weight: bold;
  background: pink;
  text-decoration: none;
  color: #fff;
}
</style>
