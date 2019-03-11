<template>
	<div  style="text-align: center" >
		<h1 >{{name}}</h1>
		<hr>
		
		<label for="">vue-checkbox:</label>
		<vue-checkbox v-model="ck" >登录</vue-checkbox>
		<br>
		<p> 选择的值:{{ck}}</p>

		<hr>
		<label for="">vue-checkbox-group:</label>
		<vue-checkbox-group  :list="list" v-model="ckGroup" ></vue-checkbox-group>
		<br>
			<p> 选择的值:{{ckGroup}}</p>
		<hr>
		<label for="">vue-radio:</label>
		<vue-radiobox :list="list" v-model="radio"></vue-radiobox>
		<br>
			<p> 选择的值:{{radio}}</p>
		
		<hr>
		<label for="">vue-checkbtn:</label>
		<vue-checkbtn v-model="checkbtn" :callback="checkbtnCallback" >
            支持
        </vue-checkbtn>
		<br>
		<p> 选择的值:{{checkbtn}}</p>
		<hr>
		<label for="">vue-checkbtn-group:</label>
		<vue-checkbtn-group :list="listBtn" v-model="ckGroupBtn"></vue-checkbtn-group>
		<br>
		<p> 选择的值:{{ckGroupBtn}}</p>

        <hr>
		<label for="">vue-radiobtn:</label>
		  <vue-radiobtn  :list="list" v-model="radiobtn"></vue-radiobtn>
		<br>
		<p> 选择的值:{{radiobtn}}</p>

        <hr>
		<label for="">vue-switch:</label>
        <vue-switch  v-model="switchVal"  :callback="checkbtnCallback"></vue-switch>
        <span>自动登录</span>
		<br>
		<p> 选择的值:{{switchVal}}</p>

        <hr>
		<label for="">vue-number:</label>
        <vue-number  v-model="number" :min="min" :max="max" :step="step"></vue-number>
		<br>
		<p> 选择的值:{{number}}</p>

	</div>
</template>

<script>
export default {
  data() {
    return { 
      name: "多页+单页应用 快速开发应用 组件列表",
      ck: true,
      list: [
        {
          key: "js",
          value: "js",
          bl: false,
          disabled: false
        },

        {
          key: "jquery",
          value: "jquery",
          bl: false,
          disabled: false
        },

        {
          key: "vue",
          value: "vue",
          bl: false,
          disabled: false
        }
      ],
      listBtn: [
        {
          key: "js",
          value: "js",
          bl: false,
          disabled: false
        },

        {
          key: "jquery",
          value: "jquery",
          bl: false,
          disabled: false
        },

        {
          key: "vue",
          value: "vue",
          bl: false,
          disabled: false
        }
      ],
      ckGroup: ["js", "vue"],
      ckGroupBtn: ["js","vue"],
      radio: "vue",
      checkbtn: true,
      radiobtn: "vue",
      switchVal: true,
      number: 3,
      min: 0,
      max: 10,
      step:1
    };
  },
  methods: {
    checkbtnCallback(value) {
      console.log(value);
    }
  },
  computed:{

  }


};
</script>


