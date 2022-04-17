<template>
    <el-dialog :visible.sync="distDig" :before-close="handleClose" width="60%">
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
                                    v-model="searchForm.studentName"
                                    placeholder="查找学生姓名"
                                    clearable
                            >
                            </el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button icon="el-icon-search" @click="getClassStudentList">搜索</el-button>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="warning" icon="el-icon-user" :disabled="multiSelStatu" @click="distStudentHandler()">批量分配学生
                            </el-button>
                        </el-form-item>

                    </el-form>
                </div>
                <div class="info-class">
                    <el-breadcrumb separator="/">
                        <template v-for="item in nowShow">
                            <el-breadcrumb-item>{{item.label}}</el-breadcrumb-item>
                        </template>

                    </el-breadcrumb>
                </div>
                <el-table
                        ref="multipleTable"
                        :data="tableData"
                        stripe
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            fixed
                            prop="studentName"
                            label="学生姓名">
                    </el-table-column>
                    <el-table-column
                            prop="studentId"
                            label="学号">
                    </el-table-column>
                </el-table>
<!--                <el-pagination-->
<!--                        @size-change="handleSizeChange"-->
<!--                        @current-change="handleCurrentChange"-->
<!--                        :page-sizes="[10, 20, 50, 100]"-->
<!--                        :current-page="current"-->
<!--                        :page-size="size"-->
<!--                        style="margin-top: 15px"-->
<!--                        layout="total, sizes, prev, pager, next, jumper"-->
<!--                        :total="total">-->
<!--                </el-pagination>-->
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
    import myMixin from "../../../globalFun";

    export default {
        name: "DistStudentDig",
        mixins: [myMixin],
        props: {
            distDig: Boolean,
            classId: Number
        },
        data() {
            return {
                total: 0,
                size: 1000,
                current: 1,

                searchForm: {},

                filterText: '',

                collegeClassTree: [],

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },

                nowShow: [],

                tableData: [],
                multipleSelection: [],
                multiSelStatu: true,
            }
        },
        created() {
            if(this.hasAuth("mem:stu:list")) {
                this.getClassTree()
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            handleClose() {
                this.$emit('update:distDig', false)
            },
            getClassTree() {
                this.$axios.get("/mem/stu/getcctree").then(res => {
                    this.collegeClassTree = res.data.data
                    this.casData = this.getTreeData(res.data.data)
                })
            },

            getClassStudentList() {
                this.$axios.get("/mem/stu/getClassStuList", {
                    params: {
                        studentName: this.searchForm.studentName,
                        classId: this.searchForm.classId,
                        current: this.current,
                        size: this.size
                    }
                }).then(res => {
                    this.tableData = res.data.data.records;
                    this.total = res.data.data.total;
                    this.getSelectedStudentList();
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            handleNodeClick(data) {
                if (this.nowShow.length == 0) {
                    this.nowShow.push(data)
                } else if (data.collegeId == 0) {
                    this.nowShow = []
                    this.nowShow.push(data)
                } else if (this.nowShow[this.nowShow.length - 1].id == data.collegeId) {
                    this.nowShow.push(data)
                } else if (this.nowShow[this.nowShow.length - 1].collegeId == data.collegeId) {
                    this.nowShow.pop()
                    this.nowShow.push(data)
                } else {
                    while (this.nowShow[this.nowShow.length - 1].collegeId != data.collegeId) {
                        this.nowShow.pop()
                        if (this.nowShow.length <= 0 || this.nowShow[this.nowShow.length - 1].collegeId == 0) {
                            this.nowShow = []
                            break
                        }
                    }
                    if (this.nowShow.length > 0) {
                        this.nowShow.pop()
                    }
                    this.nowShow.push(data)
                }

                if (data.type == 2) {
                    this.searchForm.classId = data.id
                    this.getClassStudentList()
                }
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
                this.size = val
                this.getClassStudentList()
            },
            handleCurrentChange(val) {
                this.current = val
                this.getClassStudentList()
            },

            handleChange(value) {
                console.log(value);
            },

            // 递归判断列表，把最后的children设为undefined
            getTreeData(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].children.length < 1) {
                        // children若为空数组，则将children设为undefined
                        data[i].children = undefined;
                    } else {
                        // children若不为空数组，则继续 递归调用 本方法
                        this.getTreeData(data[i].children);
                    }
                }
                return data;
            },

            getSelectedStudentList() {
                this.$axios.get("/course/dist/" + this.classId).then(res => {
                    this.$nextTick(()=> {
                        for(var i = 0; i < this.tableData.length; i++ ) {
                            if(res.data.data.studentIdList.indexOf(this.tableData[i]['studentId'])!= -1) {
                                this.toggleSelection([this.tableData[i]]);
                            }
                        }
                    })
                })
            },
            distStudentHandler() {
                var studentIds = [];
                for(var i =0; i < this.multipleSelection.length; i++) {
                    studentIds.push(this.multipleSelection[i]['studentId'])
                }
                this.$axios.post('/course/dist/submit/' + this.classId, studentIds).then(res => {
                    this.$notify({
                        showClose: true,
                        message: '分配学生成功',
                        type: 'success'
                    });
                    this.getClassStudentList();
                    // this.distDig = false;
                    // this.$emit('update:distDig', false)

                })


            }
        }
    }
</script>

<style scoped>

</style>