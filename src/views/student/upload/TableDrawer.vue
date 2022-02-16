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
                    <el-input
                            v-model="searchForm.username"
                            placeholder="用户名"
                            clearable
                    >
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="getUserList" icon="el-icon-search">搜索</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="dialogVisible = true" v-if="hasAuth('sys:user:save')" icon="el-icon-circle-plus-outline">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-popconfirm title="这是确定批量删除吗？" @onConfirm="delHandle(null)">
                        <el-button type="danger" slot="reference" :disabled="delBtlStatu" v-if="hasAuth('sys:user:delete')">批量删除</el-button>
                    </el-popconfirm>
                </el-form-item>
            </el-form>
        </div>
        <el-table
                :data="tableData"
                border
                @selection-change="handleSelectionChange"
                class="table-class">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地址">
            </el-table-column>
            <el-table-column
                    prop="icon"
                    width="100px"
                    label="操作">

                <template slot-scope="scope">
                    <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
                    <el-divider direction="vertical"></el-divider>

                    <template>
                        <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="delHandle(scope.row.id)">
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
    </el-drawer>
</template>

<script>
    export default {
        name: "TableDrawer",
        props: {
            tableDrawer: {
                type: Boolean
            }
        },
        data() {
            return {
                tableDrawer: true,
                searchForm: {},

                delBtlStatu: true,

                total: 0,
                size: 10,
                current: 1,

                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]

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

                this.delBtlStatu = val.length == 0
            },
        }
    }
</script>

<style scoped>
    .table-class {
        margin: 0px 10px 0px 10px;
    }
    .handle-box {
        margin:0 10px 10px 15px;
    }
</style>