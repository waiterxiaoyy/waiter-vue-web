<template>
    <el-drawer
            title="请确认导入数据"
            :append-to-body="true"
            :before-close="handleClose"
            direction="rtl"
            size="50%"
            :visible.sync="tableDrawer">
        <div>
            <el-form :inline="true" class="handle-box">

                <el-form-item>
                    <el-button type="primary" @click="addStudentDig = true" icon="el-icon-circle-plus-outline">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-popconfirm title="确定批量删除吗？" @onConfirm="delHandle()">
                        <el-button type="danger" slot="reference" :disabled="btStatus">批量删除</el-button>
                    </el-popconfirm>
                </el-form-item>
                <el-form-item>
                    <el-popconfirm title="即将导入学生名单？" @onConfirm="upSubmit()">
                        <el-button type="success" slot="reference" v-if="hasAuth('mem:stu:add')" :disabled="btStatus">确认导入</el-button>
                    </el-popconfirm>
                </el-form-item>
            </el-form>
        </div>
        <div class="upload-warning">
            下表为【即将导入】名单，一共【{{newList.length}}】名学生，【{{existList.length}}】名重复学生，请仔细检验名单。（数据库中已存在学生名单，请拖动到后面查看，此次导入名单将不包含重复学生。）
        </div>
        <el-table
                ref="multipleTable"
                :data="newList"
                border
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="studentName"
                    label="学生姓名">
            </el-table-column>
            <el-table-column
                    prop="studentId"
                    label="学号">
            </el-table-column>

            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="upload-danger" id="exist">
            下表为【重复学生】名单，一共【{{existList.length}}】名学生。（此次导入名单将不包含重复学生。）
        </div>
        <el-table
                ref="multipleTable"
                :data="existList"
                border
                stripe
                style="width: 100%">

            <el-table-column
                    type="index"
                    width="50">
            </el-table-column>

            <el-table-column
                    prop="studentName"
                    label="学生姓名">
            </el-table-column>
            <el-table-column
                    prop="studentId"
                    label="学号">
            </el-table-column>
        </el-table>

        <el-dialog title="新增学生" :visible.sync="addStudentDig" width="30%" >
            <el-form :model="addStudentForm" :rules="addStuFormRules" ref="addStudentForm" width="30%" label-width="80px">
                <el-form-item label="学号" prop="studentId">
                    <el-input v-model="addStudentForm.studentId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="studentName">
                    <el-input v-model="addStudentForm.studentName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addStudentDig = false">取 消</el-button>
                <el-button type="primary" @click="addStuHandle('addStudentForm')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改信息" :visible.sync="editStudentDig" width="30%" >
            <el-form :model="editForm" :rules="addStuFormRules" ref="editStudentForm" width="30%" label-width="80px">
                <el-form-item label="学号" prop="studentId">
                    <el-input v-model="editForm.studentId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="studentName">
                    <el-input v-model="editForm.studentName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editStudentDig = false">取 消</el-button>
                <el-button type="primary" @click="editSubmit()">确 定</el-button>
            </div>
        </el-dialog>
    </el-drawer>
</template>

<script>
    export default {
        name: "TableDrawer",
        props: {
            tableDrawer: {
                type: Boolean
            },
            newList: {
                type: Array
            },
            existList: {
                type: Array
            },
            uploadData: {
                type: Array
            }

        },
        data() {
            return {
                tableDrawer: true,
                searchForm: {},

                btStatus: true,

                total: 0,
                size: 10,
                current: 1,

                addStudentDig: false,

                addStudentForm: {},

                addStuFormRules: {
                    studentId: [
                        {required: true, message: '请输入11位学号', trigger: 'blur'},
                        {min: 11, max: 11, message: '请输入11位学号', trigger: 'blur'}
                    ],
                    studentName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                },
                multipleSelection: [],

                editForm: {},
                editStudentDig: false

            }
        },
        watch: {
            tableDrawer: {
                handler(newValue) {
                    this.tableDrawer = newValue
                }

            }
        },
        methods: {
            handleClose() {
                this.$emit('update:tableDrawer', false)
            },

            handleSizeChange(val) {
                this.size = val
                this.getUserList()
            },
            handleCurrentChange(val) {
                this.current = val
                this.getUserList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(this.multipleSelection)
                this.btStatus = val.length == 0
            },
            addStuHandle(formName) {
                this.$axios.post('/mem/stu/existStu', this.addStudentForm).then(res=> {
                    if(res.data.code == 200) {
                        this.$notify({
                            title: '提示',
                            message: '已添加到待导入名单',
                            position: 'top-right',
                            type: "success"
                        });
                        this.addStudentDig = false
                        this.newList.push(this.addStudentForm)
                    }
                })
            },
            delHandle() {
                var tempList = []
                for(var i = 0; i < this.newList.length; i++) {
                    if(this.multipleSelection.indexOf(this.newList[i]) != -1) {
                        continue
                    }
                    tempList.push(this.newList[i])
                }
                this.newList = tempList
            },
            editHandle(row) {

                this.editForm = row
                this.editStudentDig = true
              console.log(row)
            },
            editSubmit() {
                this.$axios.post('/mem/stu/existStu', this.editForm).then(res=> {
                    if(res.data.code == 200) {

                        var index = this.newList.indexOf(this.editForm)
                        if(index != -1) {
                            this.newList[index] = this.editForm
                        }
                        this.$notify({
                            title: '提示',
                            message: '修改信息成功',
                            position: 'top-right',
                            type: "success"
                        });
                        this.editStudentDig = false
                    }
                })

            },
            upSubmit() {
                if(this.multipleSelection == [] ||this.multipleSelection.length <= 0) {
                    this.$notify({
                        title: '提示',
                        message: '至少选择一名学生',
                        position: 'top-right',
                        type: "warning"
                    });
                    return
                }
                for(var i = 0; i < this.multipleSelection.length; i++) {
                    this.multipleSelection[i].classId = this.uploadData.classId
                }
                this.$axios.post('/mem/stu/addStuInClass', this.multipleSelection).then(res=> {
                    if(res.data.code == 200) {
                        this.$notify({
                            title: '提示',
                            message: '学生名单导入成功，' + '共【'+ this.multipleSelection.length + '】条数据',
                            position: 'top-right',
                            type: "success"
                        });
                        this.newList = []
                        this.existList = []
                        this.tableDrawer = false
                        this.$emit('update:tableDrawer', false)
                        this.$emit('func', "关闭")
                    }
                })

            },
            //锚点跳转
            goAnchor(selector) {
                var el = document.getElementById(selector)
                this.$nextTick(function () {
                    window.scrollTo({"behavior":"smooth","top":el.offsetTop});
                })
            }

        }
    }
</script>

<style lang="scss">
    .table-class {
        margin: 0px 10px 0px 10px;
    }
    .handle-box {
        margin:0 10px 10px 15px;
    }


    .el-drawer__body {
        overflow: auto;
    }

    .el-drawer__container ::-webkit-scrollbar{
        display: none;
    }

    .upload-warning {
        text-align: left;
        color: #ffffff;
        padding: 8px 16px;
        background-color: #5977b5;
        border-radius: 4px;
        border-left: 8px solid #01355d;
        margin: 5px 10px 20px 10px;
    }

    .upload-danger {
        text-align: left;
        color: #ffffff;
        padding: 8px 16px;
        background-color: #f56c6c;
        border-radius: 4px;
        border-left: 8px solid red;
        margin: 5px 10px 20px 10px;
    }


</style>