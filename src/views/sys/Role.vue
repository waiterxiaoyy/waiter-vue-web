<template>
    <div class="container">
        <el-row :gutter="25">

            <el-col span="16">
                <el-card
                        shadow="never">
                    <div class="handle-box">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-input
                                        v-model="searchForm.name"
                                        placeholder="名称"
                                        clearable
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button @click="getRoleList" icon="el-icon-search">搜索</el-button>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" v-if="hasAuth('sys:role:save')" @click="dialogVisible = true" icon="el-icon-circle-plus-outline">新增</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
                                    <el-button v-if="hasAuth('sys:role:delete')" type="danger"  slot="reference" icon="el-icon-error" :disabled="delBtlStatu">批量删除</el-button>
                                </el-popconfirm>
                            </el-form-item>
                        </el-form>
                    </div>


                    <el-table
                            ref="multipleTable"
                            :data="tableData"
                            tooltip-effect="dark"
                            style="width: 100%"
                            @row-click="roleSelect"
                            @selection-change="handleSelectionChange">

                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>

                        <el-table-column
                                prop="name"
                                label="名称"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="code"
                                label="唯一编码"
                                width="110"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="remark"
                                label="描述"
                                width="210"
                                show-overflow-tooltip>
                        </el-table-column>

                        <el-table-column
                                prop="statu"
                                width="80"
                                label="状态">
                            <template slot-scope="scope">
                                <el-tag size="small" v-if="scope.row.statu === 1" type="success">正常</el-tag>
                                <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">禁用</el-tag>
                            </template>

                        </el-table-column>
                        <el-table-column
                                prop="icon"
                                label="操作">

                            <template slot-scope="scope">

                                <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
                                <el-divider direction="vertical"></el-divider>

                                <template>
                                    <el-popconfirm title="此操作为危险操作，确认删除吗？" @confirm="delHandle(scope.row.id)">
                                        <el-button type="text" slot="reference">删除</el-button>
                                    </el-popconfirm>
                                </template>

                            </template>
                        </el-table-column>

                    </el-table>


                    <el-pagination
                            style="margin-top: 20px"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :page-sizes="[10, 20, 50, 100]"
                            :current-page="current"
                            :page-size="size"
                            :total="total">
                    </el-pagination>
                </el-card>
            </el-col>

            <el-col span="8">
                <el-card
                        shadow="never">
                    <div slot="header" class="clearfix">
                        <span>分配权限</span>
                        <el-button v-if="hasAuth('sys:role:perm')" style="float: right;" icon="el-icon-check" size="mini" type="primary" @click="submitPermFormHandle('permForm')">保存</el-button>
                    </div>
                    <el-form :model="permForm">

                        <el-tree
                                :data="permTreeData"
                                show-checkbox
                                ref="permTree"
                                :default-expand-all=false
                                node-key="id"
                                :check-strictly=true
                                :props="defaultProps">
                        </el-tree>

                    </el-form>
                </el-card>
            </el-col>

        </el-row>


        <!--新增对话框-->
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="600px"
                :before-close="handleClose">

            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-form-item label="角色名称" prop="name" label-width="100px">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="唯一编码" prop="code" label-width="100px">
                    <el-input v-model="editForm.code" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="描述" prop="remark" label-width="100px">
                    <el-input v-model="editForm.remark" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="statu" label-width="100px">
                    <el-radio-group v-model="editForm.statu">
                        <el-radio :label=0>禁用</el-radio>
                        <el-radio :label=1>正常</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
                    <el-button @click="resetForm('editForm')">重置</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Role",
        data() {
            return {
                searchForm: {},
                delBtlStatu: true,

                total: 0,
                size: 10,
                current: 1,

                dialogVisible: false,
                editForm: {},

                tableData: [],

                editFormRules: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入唯一编码', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },

                multipleSelection: [],

                permDialogVisible: false,
                permForm: {},
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                permTreeData: []
            }
        },
        created() {
            this.getRoleList()

            this.$axios.get('/sys/menu/list').then(res => {
                this.permTreeData = res.data.data
            })
        },
        methods: {
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.delBtlStatu = val.length == 0
            },

            handleSizeChange(val) {
                this.size = val
                this.getRoleList()
            },
            handleCurrentChange(val) {
                this.current = val
                this.getRoleList()
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible = false
                this.editForm = {}
            },
            handleClose() {
                this.resetForm('editForm')
            },

            getRoleList() {
                this.$axios.get("/sys/role/list", {
                    params: {
                        name: this.searchForm.name,
                        current: this.current,
                        size: this.size
                    }
                }).then(res => {
                    this.tableData = res.data.data.records
                    this.size = res.data.data.size
                    this.current = res.data.data.current
                    this.total = res.data.data.total
                })
            },

            roleSelect(row, column,event) {
                this.$axios.get("/sys/role/info/" + row.id).then(res => {
                    this.$refs.permTree.setCheckedKeys(res.data.data.menuIds)
                    this.permForm = res.data.data
                })
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/sys/role/' + (this.editForm.id ? 'update' : 'save'), this.editForm)
                            .then(res => {
                                this.getRoleList()
                                this.$notify({
                                    showClose: true,
                                    message: '操作成功',
                                    type: 'success'
                                });

                                this.dialogVisible = false
                                this.resetForm(formName)
                            })
                    } else {
                        return false;
                    }
                });
            },
            editHandle(id) {
                this.$axios.get('/sys/role/info/' + id).then(res => {
                    this.editForm = res.data.data

                    this.dialogVisible = true
                })
            },
            delHandle(id) {

                var ids = []

                if (id) {
                    ids.push(id)
                } else {
                    this.multipleSelection.forEach(row => {
                        ids.push(row.id)
                    })
                }

                this.$axios.post("/sys/role/delete", ids).then(res => {
                    this.getRoleList()
                    this.$notify({
                        showClose: true,
                        message: '删除成功',
                        type: 'success'
                    });
                })
            },

            submitPermFormHandle(formName) {
                var menuIds = this.$refs.permTree.getCheckedKeys()

                this.$axios.post('/sys/role/perm/' + this.permForm.id, menuIds).then(res => {
                    this.getRoleList()
                    this.$notify({
                        showClose: true,
                        message: '分配权限成功',
                        type: 'success'
                    });
                    this.resetForm(formName)
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