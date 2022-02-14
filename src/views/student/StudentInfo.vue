<template>
    <div class="app-container">
        <el-card>
            <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px;">
                        <el-input
                                placeholder="输入关键字进行查找"
                                v-model="filterText" style="margin-bottom: 10px">
                        </el-input>
                        <el-tree
                                class="filter-tree"
                                :data="collegeClassTree"
                                :props="defaultProps"
                                default-expand-all
                                :filter-node-method="filterNode"
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
                                        placeholder="查找学生姓名"
                                        clearable
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button icon="el-icon-search">搜索</el-button>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" icon="el-icon-circle-plus-outline" v-if="hasAuth('mem:stu:add')">新增学生</el-button>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="warning" icon="el-icon-upload" v-if="hasAuth('mem:stu:add')">批量导入</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="info" icon="el-icon-download" :disabled="multiSelStatu" v-if="hasAuth('mem:stu:download')">批量导出</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" icon="el-icon-error" :disabled="multiSelStatu" v-if="hasAuth('mem:stu:delete')">批量删除</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="info-class">
                        <el-breadcrumb separator="/">
                            <template  v-for="item in nowShow">
                                <el-breadcrumb-item>{{item.label}}</el-breadcrumb-item>
                            </template>

                        </el-breadcrumb>
                    </div>
                    <el-table
                            ref="multipleTable"
                            :data="tableData"
                            border
                            stripe
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
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
                            :page-sizes="[100, 200, 300, 400]"
                            :current-page="current"
                            :page-size="size"
                            style="margin-top: 15px"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
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
                total: 0,
                size: 10,
                current: 1,

                searchForm: {},

                filterText: '',

                collegeClassTree: [],

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },

                nowShow: [],

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
                }],
                multipleSelection: [],
                multiSelStatu: true
            }
        },
        created() {
            this.getClassTree()
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            getClassTree() {
                this.$axios.get("/mem/stu/getcctree").then(res => {
                    this.collegeClassTree = res.data.data
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            handleNodeClick(data) {
                if(this.nowShow == []) {
                    this.nowShow.push(data)
                } else if(data.collegeId == 0) {
                    this.nowShow = []
                    this.nowShow.push(data)
                } else if (this.nowShow[this.nowShow.length - 1].id == data.collegeId) {
                    this.nowShow.push(data)
                } else if (this.nowShow[this.nowShow.length - 1].collegeId == data.collegeId) {
                    this.nowShow.pop()
                    this.nowShow.push(data)
                } else {
                    while(this.nowShow[this.nowShow.length - 1].collegeId != data.collegeId) {
                        this.nowShow.pop()
                        if(this.nowShow[this.nowShow.length - 1].collegeId == 0) {
                            this.nowShow = []
                            break
                        }
                    }
                    if(this.nowShow.length > 0) {
                        this.nowShow.pop()
                    }
                    this.nowShow.push(data)
                }
                console.log(this.nowShow);
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

                this.multiSelStatu = val.length == 0
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
        margin-bottom: 0px;
    }
    .info-class {
        margin: 0px 0px 10px 0px;

    }
</style>