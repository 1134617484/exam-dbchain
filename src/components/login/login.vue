<template>
  <div class="_login">
    <div class="_content">
      <el-card class="box-card">
        <div class="_head">登录</div>
        <el-form
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
          :label-position="labelPosition"
          label-width="80px"
          :model="ruleForm"
        >
          <el-form-item
            class="_items"
            label="助记词"
            prop="mnemonic"
            :rules="rules.mnemonic"
          >
            <el-input v-model="ruleForm.mnemonic"></el-input>
            <span class="_text">助记词之间请用空格隔开</span>
          </el-form-item>
          <el-form-item label="密码" prop="password" :rules="rules.password">
            <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
          <div style="text-align: center">
            <el-button type="primary" @click="submitForm('ruleForm')"
              >立即登入</el-button
            >
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  validateMnemonic,
  newMnemonic,
  createAndStoreKey,
  setMyName,
  getChainId,
  savePassphrase,
  hasKey,
  setBaseUrl,
  setChainId,
  detectChain,
} from "dbchain-js-client";

export default {
  data() {
    // let validateMnemonic = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请输入助记词"));
    //   } else {
    //   //  this.$refs.ruleForm.validateField("mnemonic");
    //     callback();
    //   }
    // };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.password !== "") {
          this.$refs.ruleForm.validateField("password");
        }
        callback();
      }
    };
    return {
      labelPosition: "right",
      ruleForm: {
        mnemonic: "",
        password: "",
      },
      rules: {
        mnemonic: [
          { required: true, message: "请输入助记词", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入登入密码", trigger: "blur" },
          // { validator: validatePass, trigger: "blur" }
        ],
      },
    };
  },
  created() {
    console.log(this);
  },
  methods: {
    // 生成key
    async createKey() {
      // 生成对应私钥，需传入12个助记词（以中文隔开）
      createAndStoreKey(this.ruleForm.mnemonic, this.ruleForm.password);
      // 保存您设置的密码
      savePassphrase(this.ruleForm.password);
      // 设置访问参数前需调用dbchain提供的验证方法验证通过后方可设置访参，避免出现不知名错误,
      // 访回值如下 {status:false,content:'当前访参无法访问，请检查'}
      // 若不可设置，则应检查您提供的参数是否正确或网络是否存在问题
      // 此函数如非异步调用，则会返回promise，请检查需要异步调用时则需异步，否则使用中容易出错
      let isToBaseUrl = await detectChain(
        this.$APIURL.BaseUrl,
        this.$APIURL.ChainId
      );
      console.log(isToBaseUrl);
      if (!isToBaseUrl.status) return this.$message.error(isToBaseUrl.content);
      // 设置默认访问参数 节点访问地址和节点id
      setBaseUrl(this.$APIURL.BaseUrl);
      setChainId(this.$APIURL.ChainId);
      // 关闭loding
      this.$store.commit("setIsLoding", false);

      return true;
    },
    // 点击登入
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let ismnemonic = await validateMnemonic(this.ruleForm.mnemonic);
          if (!ismnemonic) {
            return this.$message.error("助记词有误，请检查");
          }
          this.$store.commit("setIsLoding", true);
          // 此处生成对应私钥
          let iskey = this.createKey();
          console.log(iskey);
          if (iskey) return this.$router.push("/home");
          return this.$message.error("创建私钥或设置节点信息失败");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
._login {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  ._content {
    width: 500px;
    ._head {
      padding-bottom: 20px;
      font-size: 18px;
    }
    ._items {
      position: relative;
      ._text {
        position: absolute;
        pointer-events: none;
        right: 9px;
        font-size: 12px;
        color: #888;
      }
    }
  }
}
</style>