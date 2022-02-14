<template>
    <div class="app-container">
        <el-card>
            <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">

                        <el-tree
                                class="filter-tree"
                                :data="collegeClassTree"
                                :props="defaultProps"
                                default-expand-all
                                @node-click="handleNodeClick"
                                ref="tree">
                        </el-tree>
                </el-col>
                <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
                    <!--操作栏 begin-->
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
                                <el-button icon="el-icon-search">搜索</el-button>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" icon="el-icon-circle-plus-outline">新增</el-button>
                            </el-form-item>
                        </el-form>
                    </div>

                    <el-table
                            :data="tableData"
                            border
                            style="width: 100%">
                        <el-table-column
                                fixed
                                prop="date"
                                label="日期"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="姓名"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="province"
                                label="省份"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="city"
                                label="市区"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="address"
                                label="地址"
                                width="300">
                        </el-table-column>
                        <el-table-column
                                prop="zip"
                                label="邮编"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                label="操作"
                                width="100">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                                <el-button type="text" size="small">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage4"
                            :page-sizes="[100, 200, 300, 400]"
                            :page-size="100"
                            style="margin-top: 15px"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="400">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "StudentInfo",
        data() {
            return {
                searchForm: {},
                collegeClassTree: [
                {
                    id: 1,
                    label: '信息学院',
                    children: [{
                        id: 4,
                        label: '软件工程',
                        children: [{
                            id: 9,
                            label: '2018软件工程1班'
                        }, {
                            id: 10,
                            label: '2018软件工程2班'
                        }]
                    }]
                }, {
                    id: 2,
                    label: '金融学院',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    children: [{
                        id: 7,
                        label: '二级 3-1'
                    }, {
                        id: 8,
                        label: '二级 3-2'
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1517 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1519 弄',
                    zip: 200333
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1516 弄',
                    zip: 200333
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1516 弄',
                    zip: 200333
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1516 弄',
                    zip: 200333
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1516 弄',
                    zip: 200333
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1516 弄',
                    zip: 200333
                }]

            }
        },
        created() {
            this.getClassTree()
        },
        methods: {
            getClassTree() {
                this.$axios.get("/mem/student/getclasstree").then(res => {
                    this.collegeClassTree = res.data.data
                })
            },

            handleNodeClick(data) {
                console.log(data);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            }
        },
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
</style>