<template>
    <div class="container">
        <!--操作栏 begin-->
        <div class="handle-box">
            <el-form :inline="true">
                <el-form-item>
                    <el-input
                            v-model="searchForm.value"
                            placeholder="输入搜索内容"
                            clearable
                    >
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="hasAuth('sys:menu:save')" type="primary" icon="el-icon-circle-plus-outline" class="mr10" @click="dialogVisible = true">创建新项目</el-button>
                </el-form-item>
            </el-form>

        </div>
        <!--操作栏 end-->

        <el-table
                :data="treeData"
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                :default-expand-all="false"
                :expand-row-keys="expandRow"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <el-table-column
                    prop="name"
                    label="名称"
                    sortable
                    width="250">
            </el-table-column>
            <el-table-column
                    prop="icon"
                    label="图标">
                <template slot-scope="scope">
                    <i :class="scope.row.icon" ></i>
                </template>
            </el-table-column>
            <el-table-column
                    prop="perms"
                    label="权限编码"
                    sortable
                    width="180">
            </el-table-column>



            <el-table-column
                    prop="type"
                    label="类型">
                <template slot-scope="scope">
                    <el-tag size="small" effect="dark" v-if="scope.row.type === 0" type="warning">目录</el-tag>
                    <el-tag size="small" effect="dark" v-else-if="scope.row.type === 1" type="success">菜单</el-tag>
                    <el-tag size="small" effect="dark" v-else-if="scope.row.type === 2" type="primary">按钮</el-tag>
                </template>

            </el-table-column>

            <el-table-column
                    prop="path"
                    label="菜单URL">
            </el-table-column>
            <el-table-column
                    prop="component"
                    label="菜单组件">
            </el-table-column>
            <el-table-column
                    prop="orderNum"
                    label="排序号">
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
                    label="操作">

                <template slot-scope="scope">
                    <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
                    <el-divider direction="vertical"></el-divider>

                    <template>
                        <el-popconfirm title="此操作为危险操作，确认删除吗？" confirm-button-text="确认" cancel-button-text="取消" @confirm="delHandle(scope.row.id)">
                            <el-button type="text" slot="reference">删除</el-button>
                        </el-popconfirm>
                    </template>

                </template>
            </el-table-column>

        </el-table>

        <!--新增对话框-->
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="600px"
                :before-close="handleClose">

            <el-form :model="editForm" label-position="right" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-form-item label="上级菜单" prop="parentId">
                    <el-select v-model="editForm.parentId" placeholder="请选择上级菜单">
                        <template v-for="item in menuList">
                            <el-option :label="item.name" :value="item.id"></el-option>
                            <template v-for="child in item.children">
                                <el-option :label="child.name" :value="child.id">
                                    <span>{{ "- " + child.name }}</span>
                                </el-option>
                            </template>
                        </template>
                    </el-select>
                </el-form-item>

                <el-form-item label="菜单名称" prop="name" label-width="100px">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="权限编码" prop="perms" label-width="100px">
                    <el-input v-model="editForm.perms" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="图标" prop="icon" label-width="100px">
                    <el-input v-model="editForm.icon" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单URL" prop="path" label-width="100px">
                    <el-input v-model="editForm.path" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="菜单组件" prop="component" label-width="100px">
                    <el-input v-model="editForm.component" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="类型" prop="type" label-width="100px">
                    <el-radio-group v-model="editForm.type">
                        <el-radio :label=0>目录</el-radio>
                        <el-radio :label=1>菜单</el-radio>
                        <el-radio :label=2>按钮</el-radio>
                    </el-radio-group>
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
                    <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
                    <el-button @click="resetForm('editForm')">重 置</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Meun",
        data () {
            return {
                dialogVisible: false,
                editForm: {

                },
                editFormRules: {
                    parentId: [
                        {required: true, message: '请选择上级菜单', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    perms: [
                        {required: true, message: '请输入权限编码', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ],
                    orderNum: [
                        {required: true, message: '请填入排序号', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
                menuList: [],
                searchForm: {},
                expandRow: []
            }
        },
        computed: {
            treeData: function () {
                var searchValue = this.searchForm.value;
                if (searchValue) {
                    // 一般表格的查询
                    // return  this.tableData.filter(function(dataNews){
                    //   return Object.keys(dataNews).some(function(key){
                    //     return String(dataNews[key]).toLowerCase().indexOf(search) > -1
                    //   })
                    // })
                    let treeData = this.menuList;
                    let handleTreeData = this.handleTreeData(treeData, searchValue)
                    this.setExpandRow(handleTreeData)
                    this.expandRow = this.expandRow.join(",").split(",")
                    return handleTreeData
                }
                return this.menuList
            }
        },
        created() {
          this.getMenuTree()
        },
        methods: {
            //  树形表格过滤
            handleTreeData(treeData, searchValue) {
                if (!treeData || treeData.length === 0) {
                    return [];
                }
                const array = [];
                for (let i = 0; i < treeData.length; i += 1) {
                    let match = false;
                    for(let pro in treeData[i]){
                        if(typeof(treeData[i][pro])=='string'){
                            match |= treeData[i][pro].includes(searchValue);
                            if(match) break;
                        }
                    }
                    if (this.handleTreeData(treeData[i].children, searchValue).length > 0 || match ) {
                        array.push({
                            ...treeData[i],
                            children: this.handleTreeData(treeData[i].children, searchValue),
                        });
                    }
                }
                return array;
            },
            // 将过滤好的树形数据展开
            setExpandRow(handleTreeData) {
                if(handleTreeData.length) {
                    for (let i of handleTreeData) {
                        this.expandRow.push(i.id)
                        if(i.children.length) {
                            this.setExpandRow(i.children)
                        }
                    }
                }
            },
            getMenuTree() {
                this.$axios.get("/sys/menu/list").then(res => {
                    var topMenu = {
                        id: 0,
                        name: '顶级目录',
                        parentId: 0,
                        type: 0,
                        statu: 1
                    }
                    this.menuList = res.data.data
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/sys/menu/' + (this.editForm.id?'update' : 'save'), this.editForm)
                            .then(res => {
                                this.getMenuTree()
                                this.$notify({
                                    showClose: true,
                                    message: '操作成功',
                                    type: 'success'
                                });

                                this.dialogVisible = false
                            })
                    } else {
                        return false;
                    }
                });
            },
            editHandle(id) {
                this.$axios.get('/sys/menu/info/' + id).then(res => {
                    this.editForm = res.data.data

                    this.dialogVisible = true
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible = false
                this.editForm = {}
            },
            handleClose() {
                this.resetForm('editForm')
            },
            delHandle(id) {

                this.$axios.post("/sys/menu/delete/" + id).then(res => {
                    this.getMenuTree()
                    if(res.data.code === 200) {
                        this.$notify({
                            showClose: true,
                            message: '删除成功',
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