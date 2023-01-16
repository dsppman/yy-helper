<template>
  <div class="main">
    <el-container @drop="importUsers" @dragleave="importUsers" @dragover="importUsers" style="height: 100%;">
      <el-aside width="200px">
        <el-button type="info" style="width: 100%" @click="loginAlipay">【第1步】登录支付宝</el-button>
        <div style="margin-top: 10px"/>
        <el-form :model="addCreditForm" :rules="addCreditFormRule" ref="addCreditFormRef">
          <el-form-item prop="amount">
            <el-input v-model.number="addCreditForm.amount" placeholder="充值金额"/>
          </el-form-item>
          <el-form-item prop="alipayPassword">
            <el-input type="password" show-password v-model="addCreditForm.alipayPassword" placeholder="支付宝支付密码"/>
          </el-form-item>
          <el-button type="primary" style="width: 100%;"
                     @click="submit( 'addCredit', addCreditForm, addCreditFormRef, 1)" :disabled="loading">充值
          </el-button>
          <div style="margin-top: 10px"/>
          <el-button style="width: 100%" @click="setCurrentRow('addCredit')">选中充值成功号</el-button>
        </el-form>
        <div style="margin-top: 10px"/>
        <el-button type="primary" style="width: 100%" @click="exportUsers">导出选中账号</el-button>
      </el-aside>
      <el-main>
        <el-table ref="userDataRef" :data="userData" height="520" border empty-text="拖入文件进来导入数据">
          <el-table-column type="selection" width="45"/>
          <el-table-column prop="username" label="账号" width="150" show-overflow-tooltip />
          <el-table-column prop="password" label="密码" width="150" show-overflow-tooltip/>
          <!--          <el-table-column prop="status" label="状态" width="60"/>-->
<!--          <el-table-column prop="info.nick" label="昵称"/>-->
          <el-table-column prop="result" label="操作状态" show-overflow-tooltip/>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {reactive, ref, toRaw} from "vue";
import async from "async";

const loading = ref(false);
const needProxy = ref(false);

const userData = ref([]);
const userDataRef = ref();
const userDataSucRows = {};

const rewardGiftForm = reactive({
  airTicket: "",
  receiverId: "",
  targetId: ""
});
const rewardGiftFormRef = ref();
const rewardGiftFormRule = {
  airTicket: [
    {required: true, message: '请输入飞机票', trigger: 'blur'},
    // {
    //   pattern: /\[sid=\d+&subid=\d+]/, message: '飞机票格式不对', trigger: 'blur'
    // },
    {
      validator: (rule, value) => {
        const [_, sid, ssid] = value.toString().match(/\[sid=(\d+?)&subid=(\d+?)]/) || [];
        if (!sid || !ssid) return Error("飞机票格式不对")
        rewardGiftForm.sid = sid
        rewardGiftForm.ssid = ssid
        return true
      },
      trigger: 'blur'
    }
  ],
  receiverId: [
    {required: true, message: '请输入主持人yy号', trigger: 'blur'},
    {type: 'number', message: '主持人yy号必须为数字', trigger: 'blur'},
    {
      validator: async (rule, value) => {
        let uid = localStorage.getItem(value)
        if (!uid) {
          uid = await window.yy('getUID', value)
          localStorage.setItem(value, uid)
        }
        rewardGiftForm.recveruid = uid
        return true
      },
      trigger: '-'
    }
  ],
  targetId: [
    {required: true, message: '请输入嘉宾yy号', trigger: 'blur'},
    {type: 'number', message: '嘉宾yy号必须为数字', trigger: 'blur'},
    {
      validator: async (rule, value) => {
        let uid = localStorage.getItem(value)
        if (!uid) {
          uid = await window.yy('getUID', value)
          localStorage.setItem(value, uid)
        }
        rewardGiftForm.target = uid
        return true
      },
      trigger: '-'
    }
  ]
}

const addCreditForm = reactive({
  amount: "",
  alipayNumber: "",
  alipayPassword: ""
});
const addCreditFormRef = ref()
const addCreditFormRule = {
  amount: [
    {required: true, message: '请输入充值金额', trigger: 'blur'},
    {type: 'number', message: '金额必须为数字', trigger: 'blur'}
  ],
  alipayNumber: [
    {required: true, message: '请输入支付宝账号', trigger: 'blur'}
  ],
  alipayPassword: [
    {required: true, message: '请输入支付宝支付密码', trigger: 'blur'}
  ]
}

const buyGiftForm = reactive({
  propsId: "",
});
const buyGiftFormRef = ref()
const buyGiftFormRule = {
  propsId: [
    {required: true, message: '请选择需购买礼包ID', trigger: 'blur'},
    {type: 'number', message: '礼包ID必须为数字', trigger: 'blur'}
  ],
}
//test
window.yy('importUsers', 'C:\\Users\\dsppm\\Pictures\\111\\8.2.txt').then(data => userData.value = data)

// rewardGiftForm.airTicket = "yy://pd-[sid=398&subid=2567178994]"
// rewardGiftForm.receiverId = 919439
// rewardGiftForm.targetId = 919439
// addCreditForm.amount = 1
// addCreditForm.alipayNumber = "18022712849"
// addCreditForm.alipayPassword = "522100"


/**
 * 设置选中行
 * @param name
 */
function setCurrentRow(name) {
  userDataRef.value.clearSelection()
  // userDataRef.value.toggleRowSelection(userDataSucRows[name], true)
  userDataSucRows[name]?.forEach(row => userDataRef.value.toggleRowSelection(row, true))
  console.log(userDataSucRows[name])
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


async function submit(name, options, formRef, max = 5) {
  console.log(`${name} start. max ${max}`);
  // if (!['rewardGift', 'addCredit','buyGift', 'login'].includes(name)) return;
  await formRef?.validate().catch(() => {
    throw Error("请检查参数")
  });

  const userDataCurrentRow = userDataRef.value.getSelectionRows();
  if (userDataCurrentRow.length === 0) throw Error("请先选中账号");
  loading.value = true;
  try {
    userDataSucRows[name] = []
    // await async.mapLimit(userDataCurrentRow, 1, async user => {
    //   user.result = '正在操作中';
    //   const userData = {
    //     username: user.username,
    //     password: user.password,
    //     cookie: user.cookie
    //   }
    //   window.yy(name, userData, toRaw(options)).then(({cookie, info, result}) => {
    //     if (cookie) user.cookie = cookie;
    //     if (info) user.info = info
    //     if (result) {
    //       userDataSucRows[name].push(user)
    //     }
    //   }).catch(e => {
    //     user.result = e.message
    //   })
    //   await delay(7000);
    // });


    await async.mapLimit(userDataCurrentRow, max, async user => {
      user.result = '正在操作中'
      try {
        const userData = {
          username: user.username,
          password: user.password,
          cookie: user.cookie
        }
        const {cookie, info, result} = await window.yy(name, userData, toRaw(options)) || {}
        if (cookie) user.cookie = cookie;
        if (info) user.info = info
        if (result) {
          userDataSucRows[name].push(user)
        }
        user.result = result || '无结果...'
      } catch (e) {
        user.result = e.message
      }
    })
  } finally {
    loading.value = false
  }

}

/**
 * 导入并处理账号信息
 * @param e
 * @returns {Promise<void>}
 */
async function importUsers(e) {
  e.stopPropagation();
  e.preventDefault();
  const files = e.dataTransfer.files;
  if (files && files.length > 0)
    userData.value = await window.yy('importUsers', files[0].path) || []
}


async function exportUsers() {
  const users = userDataRef.value.getSelectionRows()
  let data = []
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    data.push([user.username, user.password, user.cookie].filter(_ => _).join('----'))
  }
  await window.yy('exportUsers', data.join('\r\n'))
}

async function loginAlipay() {
  await window.yy('loginAlipay')
}

</script>

<style>
body {
  margin: 0;
}

.el-aside {
  padding: 20px 0 20px 20px;
}
</style>