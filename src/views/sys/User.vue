<template>
    <div class="container">
        <div class="handle-box">
            <el-form :inline="true">
                <el-form-item>
                    <el-input
                            v-model="searchForm.username"
                            placeholder="用户名"
                            clearable
                    >
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="" icon="el-icon-search">搜索</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="dialogVisible = true" v-if="hasAuth('sys:user:save')" icon="el-icon-circle-plus-outline">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
                        <el-button type="danger" slot="reference" :disabled="delBtlStatu" v-if="hasAuth('sys:user:delete')">批量删除</el-button>
                    </el-popconfirm>
                </el-form-item>
            </el-form>
        </div>

        <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                stripe
                @selection-change="handleSelectionChange">

            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="创建时间">
                            <span>{{ props.row.created }}</span>
                        </el-form-item>
                        <el-form-item label="修改时间">
                            <span>{{ props.row.updated }}</span>
                        </el-form-item>
                        <el-form-item label="最近登录时间">
                            <span>{{ props.row.lastLogin }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>

            <el-table-column
                    label="头像"
                    width="50">
                <template slot-scope="scope">
                    <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
                </template>
            </el-table-column>

            <el-table-column
                    prop="username"
                    label="用户名"
                    width="120">
            </el-table-column>

            <el-table-column
                    prop="nickname"
                    label="实名"
                    width="120">
            </el-table-column>

            <el-table-column
                    prop="nickname"
                    label="性别" width="45">
                <template slot-scope="scope">
                    <a v-if="scope.row.sex == 0">女</a>
                    <a v-if="scope.row.sex == 1">男</a>
                </template>
            </el-table-column>

            <el-table-column
                    prop="code"
                    label="角色名称" width="180">
                <template slot-scope="scope">
                    <el-tag size="small" type="warning" v-for="item in scope.row.sysRoles" :key="item" style="margin-right:2px;margin-top: 2px;">{{item.name}}</el-tag>
                </template>

            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱" width="140">
            </el-table-column>
            <el-table-column
                    prop="zzstatus"
                    label="政治面貌">
            </el-table-column>

            <el-table-column
                    prop="statu"
                    label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.statu === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">禁用</el-tag>
                </template>

            </el-table-column>

            <el-table-column
                    prop="icon"
                    width="260px"
                    label="操作">

                <template slot-scope="scope">
                    <el-button type="text" @click="roleHandle(scope.row.id)">分配角色</el-button>
                    <el-divider direction="vertical"></el-divider>

                    <el-button type="text" @click="repassHandle(scope.row.id, scope.row.username)">重置密码</el-button>
                    <el-divider direction="vertical"></el-divider>

                    <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
                    <el-divider direction="vertical"></el-divider>

                    <template>
                        <el-popconfirm title="此操作为危险操作，确定删除吗？" @confirm="delHandle(scope.row.id)">
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


        <!--新增对话框-->
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="600px"
                :before-close="handleClose">

            <el-form :model="editForm" :rules="editFormRules" ref="editForm">
                <el-form-item label="用户名" prop="username" label-width="100px">
                    <el-input v-model="editForm.username" autocomplete="off"></el-input>
                    <el-alert
                            title="初始密码为888888"
                            :closable="false"
                            type="info"
                            style="line-height: 12px;"
                    ></el-alert>
                </el-form-item>

                <el-form-item label="邮箱"  prop="email" label-width="100px">
                    <el-input v-model="editForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所在城市"  prop="city" label-width="100px">
                    <el-input v-model="editForm.city" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="政治面貌"  prop="zzstatus" label-width="100px">
                    <el-select style="width: 100%" v-model="editForm.zzstatus" placeholder="请选择政治面貌">
                        <el-option label="中共党员" value="中共党员"></el-option>
                        <el-option label="中共预备党员" value="中共预备党员"></el-option>
                        <el-option label="共青团员" value="共青团员"></el-option>
                        <el-option label="群众" value="群众"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别"  prop="sex" label-width="100px">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="1">男</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="状态"  prop="statu" label-width="100px">
                    <el-radio-group v-model="editForm.statu">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('editForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible" width="600px">

            <el-form :model="roleForm">
                <el-tree
                        :data="roleTreeData"
                        show-checkbox
                        ref="roleTree"
                        :check-strictly=checkStrictly
                        node-key="id"
                        :default-expand-all=true
                        :props="defaultProps">
                </el-tree>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="roleDialogFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="submitRoleHandle('roleForm')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "User",
        data() {
            return {
                searchForm: {},
                delBtlStatu: true,

                total: 0,
                size: 10,
                current: 1,

                dialogVisible: false,
                editForm: {

                },

                tableData: [],

                editFormRules: {
                    username: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },

                multipleSelection: [],

                roleDialogFormVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleForm: {},
                roleTreeData:  [],
                treeCheckedKeys: [],
                checkStrictly: true

            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            getRoleList() {
                this.$axios.get("/sys/role/list").then(res => {
                    this.roleTreeData = res.data.data.records
                })
            },
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
                this.getUserList()
            },
            handleCurrentChange(val) {
                this.current = val
                this.getUserList()
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible = false
                this.editForm = {}
            },
            handleClose() {
                this.resetForm('editForm')
            },

            getUserList() {
                this.$axios.get("/sys/user/list", {
                    params: {
                        username: this.searchForm.username,
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

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/sys/user/' + (this.editForm.id?'update' : 'save'), this.editForm)
                            .then(res => {
                                this.getUserList()
                                this.$notify({
                                    showClose: true,
                                    message: '操作成功',
                                    type: 'success',
                                });

                                this.dialogVisible = false
                            })
                    } else {
                        return false;
                    }
                });
            },
            editHandle(id) {
                this.$axios.get('/sys/user/info/' + id).then(res => {
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


                this.$axios.post("/sys/user/delete", ids).then(res => {
                    this.getUserList()
                    this.$notify({
                        showClose: true,
                        message: '删除成功',
                        type: 'success'
                    });
                })
            },

            roleHandle (id) {
                this.getRoleList()
                this.roleDialogFormVisible = true

                this.$axios.get('/sys/user/info/' + id).then(res => {
                    this.roleForm = res.data.data

                    let roleIds = []
                    res.data.data.sysRoles.forEach(row => {
                        roleIds.push(row.id)
                    })

                    this.$refs.roleTree.setCheckedKeys(roleIds)
                })
            },
            submitRoleHandle(formName) {
                var roleIds = this.$refs.roleTree.getCheckedKeys()

                this.$axios.post('/sys/user/role/' + this.roleForm.id, roleIds).then(res => {
                    this.getUserList()
                    this.$notify({
                        showClose: true,
                        message: '更新成功',
                        type: 'success'
                    });

                    this.roleDialogFormVisible = false
                })
            },
            repassHandle(id, username) {

                this.$confirm('将重置用户【' + username + '】的密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/user/repass", id).then(res => {
                        this.getUserList()
                        this.$notify({
                            showClose: true,
                            message: '重置密码成功',
                            type: 'success'
                        });
                    })
                })
            }
        }
    }
</script>

<style>

    .handle-box {
        margin-bottom: 20px;
    }

    /*.el-pagination {*/
    /*    float: right;*/
    /*    margin-top: 5px;*/
    /*}*/

    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 100px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

</style>