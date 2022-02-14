<template>
    <div class="container">
        <!--操作栏 begin-->
        <div class="handle-box">
            <el-button type="success" icon="el-icon-circle-plus-outline" class="mr10" @click="addCollegeDialogVisible = true" v-if="hasAuth('sys:dept:add')">创建学院</el-button>
            <el-button type="primary" icon="el-icon-circle-plus-outline" class="mr10" @click="classDialogVisible = true" v-if="hasAuth('sys:dept:add')">创建专业 / 班级</el-button>
        </div>
        <!--操作栏 end-->

        <el-table
                :data="tableData"
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                default-expand-all
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <el-table-column
                    prop="name"
                    label="名称"
                    sortable
                    width="250">
            </el-table-column>
            <el-table-column
                    prop="created"
                    label="创建时间"
                    width="180">
            </el-table-column>

            <el-table-column
                    prop="updated"
                    label="更新时间"
                    width="180">
            </el-table-column>

            <el-table-column
                    prop="type"
                    label="类型">
                <template slot-scope="scope"  >
                    <el-tag size="small" effect="dark" v-if="scope.row.type === 0">学院</el-tag>
                    <el-tag size="small" effect="dark" v-else-if="scope.row.type === 1" type="success">专业</el-tag>
                    <el-tag size="small" effect="dark" v-else-if="scope.row.type === 2" type="warning">班级</el-tag>
                </template>

            </el-table-column>

            <el-table-column
                    prop="statu"
                    label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.statu === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">关闭</el-tag>
                </template>

            </el-table-column>
            <el-table-column
                    prop="icon"
                    label="操作" v-if="hasAuth('sys:dept:update')">

                <template slot-scope="scope" >
                    <el-button type="text" @click="editHandle(scope.row)">编辑</el-button>
                    <el-divider direction="vertical"></el-divider>

                    <template>
                        <el-popconfirm title="此操作为危险操作，是否确认删除" confirm-button-text="确认" cancel-button-text="取消" @onConfirm="delHandle(scope.row.id)">
                            <el-button type="text" slot="reference">删除</el-button>
                        </el-popconfirm>
                    </template>

                </template>
            </el-table-column>

        </el-table>

        <!--创建学院对话框-->
        <el-dialog
                title="增加学院"
                :visible.sync="addCollegeDialogVisible"
                width="600px"
                :before-close="handleAddCollegeClose">

            <el-form :model="editForm" :rules="addColegeFormRules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-form-item label="学院名称" prop="name" label-width="100px">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>


                <el-form-item label="类型" prop="type" label-width="100px">
                    <el-radio-group v-model="editForm.type">
                        <el-radio>学院</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="排序号" prop="orderNum" label-width="100px">
                    <el-input-number v-model="editForm.orderNum" :min="1" label="排序号">1</el-input-number>
                </el-form-item>

                <el-form-item label="状态" prop="statu" label-width="100px">
                    <el-radio-group v-model="editForm.statu">
                        <el-radio :label=0>禁用</el-radio>
                        <el-radio :label=1>正常</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="addCollege('editForm')">立即创建</el-button>
                    <el-button @click="resetForm('editForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--管理专业/班级对话框-->
        <el-dialog
                title="提示"
                :visible.sync="classDialogVisible"
                width="600px"
                :before-close="handleClassClose">

            <el-form :model="editForm" :rules="editClassFormRules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-form-item label="类型" prop="type" label-width="100px" v-if="editForm.type != 0">
                    <el-radio-group v-model="editForm.type">
                        <el-radio :label=1>专业</el-radio>
                        <el-radio :label=2>班级</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="上级组织" prop="collegeId" v-if="editForm.type == 2 ">
                    <el-select v-model="editForm.collegeId" placeholder="请选择上级菜单">
                        <template v-for="item in tableData">
                            <el-option :label="item.name" :value="item.id"></el-option>
                            <template v-for="child in item.children">
                                <el-option :label="child.name" :value="child.id">
                                    <span>{{ "- " + child.name }}</span>
                                </el-option>
                            </template>
                        </template>
                    </el-select>
                </el-form-item>

                <el-form-item label="上级组织" prop="collegeId" v-else-if="editForm.type == 1">
                    <el-select v-model="editForm.collegeId" placeholder="请选择上级组织">
                        <template v-for="item in tableData">
                            <el-option :label="item.name" :value="item.id"></el-option>
                        </template>
                    </el-select>
                </el-form-item>

                <el-form-item label="名称" prop="name" label-width="100px">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="statu" label-width="100px">
                    <el-radio-group v-model="editForm.statu">
                        <el-radio :label=0>禁用</el-radio>
                        <el-radio :label=1>正常</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="排序号" prop="orderNum" label-width="100px">
                    <el-input-number v-model="editForm.orderNum" :min="1" label="排序号">1</el-input-number>
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="addClassForm('editForm')">确 定</el-button>
                    <el-button @click="resetForm('editForm')">重 置</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Dept",
        data () {
            return {
                addCollegeDialogVisible: false,
                classDialogVisible: false,
                editForm: {

                },
                addColegeFormRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    orderNum: [
                        {required: true, message: '请填入排序号', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
                editClassFormRules: {
                    collegeId: [
                        {required: true, message: '请选择上级组织', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择类型', trigger: 'blur'}
                    ],
                    orderNum: [
                        {required: true, message: '请填入排序号', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
                tableData: []
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.$axios.get("/sys/dept/getlist").then(res => {
                    this.tableData = res.data.data
                })
            },

            addCollege(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editForm.type = 0
                        this.$axios.post('/sys/dept/createcollege', this.editForm)
                            .then(res => {
                                this.resetForm('editForm')
                                this.getList()
                                this.$notify({
                                    showClose: true,
                                    message: '学院 <' + res.data.data.name + '> 创建成功',
                                    type: 'success'
                                });

                                this.addCollegeDialogVisible = false
                            })
                    } else {
                        this.resetForm("editForm")
                        return false
                    }
                });
            },

            addClassForm(formName) {
                this.$refs[formName].validate((valid) => {

                    if (valid) {
                        this.$axios.post('/sys/dept/' + (this.editForm.id?'update' : 'createclass'), this.editForm)
                            .then(res => {
                                this.resetForm('editForm')
                                this.getList()
                                this.$notify({
                                    showClose: true,
                                    message: '操作<' +  res.data.data.name + '>' + '成功',
                                    type: 'success'
                                });

                                this.classDialogVisible = false
                            })
                    } else {
                        this.resetForm("editForm")
                        return false;
                    }
                });
            },
            editHandle(scoreRow) {
                this.editForm = scoreRow
                this.classDialogVisible = true
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.addCollegeDialogVisible = false
                this.classDialogVisible = false
                this.editForm = {}
            },
            handleAddCollegeClose() {
                this.resetForm('editForm')
                this.addCollegeDialogVisible = false
            },
            handleClassClose() {
                this.resetForm('editForm')
                this.classDialogVisible  = false
            },
            delHandle(id) {
                this.$axios.post("/sys/dept/delete/" + id).then(res => {
                    this.getList()
                    if(res.data.code === 200) {
                        this.$notify({
                            showClose: true,
                            message: '删除操作成功',
                            type: 'success'
                        });
                    }

                })
            }
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
</style>