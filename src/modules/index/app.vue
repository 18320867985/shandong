<template>
	<div id="app" class="container" style="padding:20px;">
<!--    
    <h3>Router</h3>
    <ul class="nav nav-pills" role="tablist">
      <li role="presentation" class="active">
        <router-link to="/">home</router-link>
      </li>
      <li role="presentation" >
        <router-link to="/router1">router1</router-link>
      </li>
      <li role="presentation" >
        <router-link to="/router2">router2</router-link>
      </li>
    </ul>

    <router-view></router-view> -->

    <vue-list><vue-list>
		
		
  </div>
</template>

<script>
import vueList from "./vue-list.vue"
export default {
    data() {
        return {
            name: '多页+单页应用 快速开发应用 3'
        };
    },
    components:{
      vueList
    }
};
 
</script>



