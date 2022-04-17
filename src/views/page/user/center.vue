<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>个人信息</span>
                    </div>
                    <div>
                        <div style="text-align: center">
                            <div class="el-upload">
                                <img :src="user.avatar"
                                     title="点击上传头像" class="avatar">
                            </div>
                        </div>
                        <ul class="user-info">
                            <li>
                                <div style="height: 100%">
                                    <svg-icon icon-class="login"/>
                                    学号
                                    <div class="user-right">{{ user.username }}</div>
                                </div>
                            </li>
                            <li>
                                <svg-icon icon-class="user1"/>
                                姓名
                                <div class="user-right">{{ user.nickname }}</div>
                            </li>
                            <li>
                                <svg-icon icon-class="dept"/>
                                性别
                                <div class="user-right">
                                    <span v-if="user.sex == 1">男</span>
                                    <span v-if="user.sex == 0">女</span>
                                </div>
                            </li>
                            <li>
                                <svg-icon icon-class="dept"/>
                                所属学院
                                <div class="user-right"> {{ user.college }}</div>
                            </li>
                            <li>
                                <svg-icon icon-class="email"/>
                                用户邮箱
                                <div class="user-right">{{ user.email }}</div>
                            </li>
                            <li>
                                <svg-icon icon-class="user1"/>
                                政治身份
                                <div class="user-right">{{ user.zzstatus }}</div>
                            </li>
                            <li>
                                <svg-icon icon-class="user1"/>
                                地区
                                <div class="user-right">{{ user.city }}</div>
                            </li>

                            <li>
                                <svg-icon icon-class="anq"/>
                                安全设置
                                <div class="user-right">
                                    <a @click="updatePassDig = true" style="cursor:pointer;">修改密码</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
                <!--    用户资料    -->
                <el-card class="box-card">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="用户资料" name="first">
                            <el-form ref="infoForm" :model="user" :rules="rules" style="margin-top: 10px;" size="small"
                                     label-width="80px">
                                <el-form-item label="昵称" prop="nickname">
                                    <el-input v-model="user.nickname" style="width: 35%"/>
                                    <span style="color: #C0C0C0;margin-left: 10px;">用户昵称不作为登录使用</span>
                                </el-form-item>
                                <el-form-item label="用户邮箱" prop="email">
                                    <el-input v-model="user.email" style="width: 35%;"/>
                                    <span style="color: #C0C0C0;margin-left: 10px;">邮箱需正确填写</span>
                                </el-form-item>
                                <el-form-item label="政治身份" prop="zzstatus">
                                    <el-input v-model="user.zzstatus" style="width: 35%;"/>
                                    <span style="color: #C0C0C0;margin-left: 10px;">政治面貌如实填写</span>
                                </el-form-item>
                                <el-form-item label="地区" prop="city">
                                    <el-input v-model="user.city" style="width: 35%;"/>
                                    <span style="color: #C0C0C0;margin-left: 10px;">请输入常居地址</span>
                                </el-form-item>
                                <el-form-item label="性别">
                                    <el-radio-group v-model="user.sex" style="width: 178px">
                                        <el-radio :label="1">男</el-radio>
                                        <el-radio :label="0">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="">
                                    <el-button size="mini" type="primary" @click="editHandle('infoForm')">保存信息</el-button>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
<!--                        &lt;!&ndash;    我的成绩    &ndash;&gt;-->
<!--                        <el-tab-pane label="我的成绩" name="second">-->
<!--                            &lt;!&ndash;操作栏 begin&ndash;&gt;-->
<!--                            <div class="handle-box">-->
<!--                                <el-dropdown>-->
<!--                                    <el-button type="primary">-->
<!--                                        选择学期<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--                                    </el-button>-->
<!--                                    <el-dropdown-menu slot="dropdown">-->
<!--                                        <el-dropdown-item>黄金糕</el-dropdown-item>-->
<!--                                        <el-dropdown-item>狮子头</el-dropdown-item>-->
<!--                                        <el-dropdown-item>螺蛳粉</el-dropdown-item>-->
<!--                                        <el-dropdown-item>双皮奶</el-dropdown-item>-->
<!--                                        <el-dropdown-item>蚵仔煎</el-dropdown-item>-->
<!--                                    </el-dropdown-menu>-->
<!--                                </el-dropdown>-->
<!--                                <el-tag style="margin-left: 15px" size="medium" color="#00d1b2" effect="dark">-->
<!--                                    2020-2021-1-->
<!--                                </el-tag>-->
<!--                            </div>-->
<!--                            <el-table-->
<!--                                    :data="grade"-->
<!--                                    style="width: 100%"-->
<!--                                    :row-class-name="tableRowClassName">-->
<!--                                <el-table-column-->
<!--                                        prop="term"-->
<!--                                        label="学期"-->
<!--                                        width="100">-->
<!--                                </el-table-column>-->
<!--                                <el-table-column-->
<!--                                        prop="courseid"-->
<!--                                        label="课程号"-->
<!--                                        width="100">-->
<!--                                </el-table-column>-->
<!--                                <el-table-column-->
<!--                                        prop="course"-->
<!--                                        label="课程名称"-->
<!--                                        width="150">-->
<!--                                </el-table-column>-->
<!--                                <el-table-column-->
<!--                                        prop="regularScore"-->
<!--                                        label="平时成绩"-->
<!--                                        align="center">-->
<!--                                </el-table-column>-->
<!--                                <el-table-column-->
<!--                                        prop="experimentScore"-->
<!--                                        label="实验成绩"-->
<!--                                        align="center">-->
<!--                                </el-table-column>-->
<!--                                <el-table-column-->
<!--                                        prop="finalScore"-->
<!--                                        label="期末成绩"-->
<!--                                        align="center">-->
<!--                                </el-table-column>-->
<!--                                <el-table-column-->
<!--                                        prop="credit"-->
<!--                                        label="学分"-->
<!--                                        align="center">-->
<!--                                </el-table-column>-->
<!--                                <el-table-column-->
<!--                                        prop="coursecategory"-->
<!--                                        label="课程属性"-->
<!--                                        align="center">-->
<!--                                </el-table-column>-->
<!--                                <el-table-column-->
<!--                                        prop="courseNature"-->
<!--                                        label="课程性质"-->
<!--                                        align="center">-->
<!--                                </el-table-column>-->
<!--                                <el-table-column-->
<!--                                        prop="examNature"-->
<!--                                        label="考试性质">-->
<!--                                </el-table-column>-->
<!--                            </el-table>-->
<!--                        </el-tab-pane>-->
                    </el-tabs>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog title="修改密码" :visible.sync="updatePassDig" width="30%">
            <el-form :model="updatePassForm" label-width="95px" ref="updatePassForm" :rules="updateFormRules">
                <el-form-item label="旧密码：" prop="password" class="form-item">
                    <el-input type="password" v-model="updatePassForm.currentPass" autocomplete="off" width="50%"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="currentPass" class="form-item">
                    <el-input type="password" v-model="updatePassForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="confirmPass" class="form-item">
                    <el-input type="password" v-model="updatePassForm.confirmPass" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <a @click="updatePassDig = false" style="color: #317ef3; font-size: 14px;margin-right: 10px;cursor:pointer;">取消</a>
                <el-button type="primary" @click="updatePass('updatePassForm')">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {isvalidPhone} from '@/utils/validate'

    export default {
        name: "center",
        data() {
            // 自定义验证
            const validPhone = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入电话号码'))
                } else if (!isvalidPhone(value)) {
                    callback(new Error('请输入正确的11位手机号码'))
                } else {
                    callback()
                }
            }
            return {
                activeName: 'first',
                user: {},
                form: {},
                updatePassDig: false,
                updatePassForm: {},
                rules: {
                    nickname: [
                        {required: true, message: '请输入用户昵称', trigger: 'blur'},
                        {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱地址',trigger: 'blur'},
                        {type: 'email',message: '请输入正确的邮箱地址',trigger: ['blur', 'change']}
                    ],
                    city: [
                        {required: true, message: '请输入常居地址', trigger: 'blur'},
                        {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
                    ],
                    zzstatus: [
                        {required: true, message: '政治面貌不能为空', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                },
                updateFormRules: {
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ],
                    currentPass: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ],
                    confirmPass: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ],
                },
                grade: [
                    {
                        studentid: "18251104126",
                        term: "2020-2021-1",
                        courseid: "16036303",
                        course: "人机交互技术",
                        regularScore: 87,
                        experimentScore: 0,
                        finalScore: 95,
                        totalmark: 93,
                        credit: 3,
                        coursecategory: "必修",
                        courseNature: "专业课",
                        examNature: "正常考试"
                    },
                    {
                        studentid: "18251104126",
                        term: "2020-2021-1",
                        courseid: "16036303",
                        course: "人机交互技术",
                        regularScore: 87,
                        experimentScore: 0,
                        finalScore: 95,
                        totalmark: 93,
                        credit: 3,
                        coursecategory: "必修",
                        courseNature: "专业课",
                        examNature: "正常考试"
                    },
                    {
                        studentid: "18251104126",
                        term: "2020-2021-1",
                        courseid: "16036303",
                        course: "人机交互技术",
                        regularScore: 87,
                        experimentScore: 0,
                        finalScore: 95,
                        totalmark: 93,
                        credit: 3,
                        coursecategory: "必修",
                        courseNature: "专业课",
                        examNature: "正常考试"
                    },
                    {
                        studentid: "18251104126",
                        term: "2020-2021-1",
                        courseid: "16036303",
                        course: "人机交互技术",
                        regularScore: 87,
                        experimentScore: 0,
                        finalScore: 95,
                        totalmark: 93,
                        credit: 3,
                        coursecategory: "必修",
                        courseNature: "专业课",
                        examNature: "正常考试"
                    },
                    {
                        studentid: "18251104126",
                        term: "2020-2021-1",
                        courseid: "16036303",
                        course: "人机交互技术",
                        regularScore: 87,
                        experimentScore: 0,
                        finalScore: 95,
                        totalmark: 93,
                        credit: 3,
                        coursecategory: "必修",
                        courseNature: "专业课",
                        examNature: "正常考试"
                    },
                ]
            }
        },
        created() {
            this.getUserInfo()
        },
        methods: {
            getUserInfo() {
                this.$axios.get('/sys/userInfo').then(res => {
                    this.user = res.data.data
                })
            },
            toggleShow() {
                this.show = !this.show
            },
            handleClick(tab, event) {
                if (tab.name === 'second') {
                    this.init()
                }
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';
            },
            editHandle(formName) {
                this.$refs[formName].validate( (valid) => {
                    if(valid) {
                        this.$axios.post('/sys/updateme', this.user).then(res =>{
                            if(res.data.code == 200) {
                                this.getUserInfo()
                                this.$notify({
                                    showClose: true,
                                    message: '用户信息更新成功',
                                    type: 'success'
                                });
                            }
                        })
                    }
                } )

            },
            updatePass (formName) {
                if(this.updatePassForm.password != this.updatePassForm.confirmPass) {
                    this.$notify({
                        showClose: true,
                        message: '两次密码输入不一致',
                        type: 'warning'
                    });
                    return
                }
                this.$refs[formName].validate((valid)=> {
                    if(valid) {
                        this.$axios.post('/sys/user/updatePass', this.updatePassForm).then(res => {
                            this.updatePassForm = {}
                            if(res.data.code == 200) {
                                this.$notify({
                                    showClose: true,
                                    message: '密码已成功更换',
                                    type: 'success'
                                });
                            }
                            this.updatePassDig = false
                        })
                    }
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info {
        padding-left: 0;
        list-style: none;

        li {
            border-bottom: 1px solid #F0F3F4;
            padding: 11px 0;
            font-size: 13px;
        }

        .user-right {
            float: right;

            a {
                color: #317EF3;
            }
        }

    }

    .handle-box {
        margin-bottom: 20px;
    }

    .form-item .el-form-item__label{
        font-weight: bold;
    }

</style>