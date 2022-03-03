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
                                        v-model="searchForm.teacherName"
                                        placeholder="查找教师姓名"
                                        clearable
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button icon="el-icon-search" @click="getMajorTeacherList">搜索</el-button>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addDig = true" v-if="hasAuth('mem:stu:add')">新增教师</el-button>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="danger" icon="el-icon-error" :disabled="multiSelStatu" v-if="hasAuth('mem:stu:delete')" @click="delHandle(null)">批量删除</el-button>
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
                            stripe
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                                fixed
                                prop="teacherName"
                                label="教师姓名">
                        </el-table-column>
                        <el-table-column
                                prop="teacherId"
                                label="教师ID">
                        </el-table-column>
                        <el-table-column
                                prop="beginTime"
                                label="入职时间">
                        </el-table-column>

                        <el-table-column
                                fixed="right"
                                label="操作">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" size="small">编辑</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <template>
                                    <el-popconfirm title="此操作为危险操作，确定删除吗？" @onConfirm="delHandle(scope.row)">
                                        <el-button type="text" slot="reference">删除</el-button>
                                    </el-popconfirm>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[10, 20, 50, 100]"
                            :current-page="current"
                            :page-size="size"
                            style="margin-top: 15px"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </el-col>
            </el-row>

        </el-card>

        <el-dialog title="新增教师" :visible.sync="addDig" width="30%" >
            <el-form :model="addStudentForm" :rules="addStuFormRules" ref="addStudentForm" width="30%" label-width="80px">
                <el-form-item label="选择专业" prop="casSelectData">
                    <el-cascader
                            width="100%"
                            style="width: 100%;"
                            v-model="addStudentForm.casSelectData"
                            :options="casData"
                            placeholder="请选择要导入的班级"
                            :props="optionProps"
                            @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="教师ID" prop="studentId">
                    <el-input v-model="addStudentForm.teacherId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="教师姓名" prop="studentName">
                    <el-input v-model="addStudentForm.teacherName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDig = false">取 消</el-button>
                <el-button type="primary" @click="addStuHandle('addStudentForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "TeacherInfo",

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

                tableData: [],
                multipleSelection: [],
                multiSelStatu: true,

                uploadDrawer: false,

                addDig: false,

                addStudentForm: {},

                addStuFormRules: {
                    casSelectData: [
                        {required: true, message: '请选择专业',trigger: 'blur'},
                        {type: 'array',message: '请选择专业',trigger: ['blur', 'change']}
                    ],
                    teacherId: [
                        {required: true, message: '请输入11位学号', trigger: 'blur'},
                        {min: 11, max: 11, message: '请输入11位学号', trigger: 'blur'}
                    ],
                    teacherName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                },

                optionProps: {
                    value: 'id',
                    label: 'label',
                    children: 'children'
                },// 格式化工单信息
                casData: [],
                casSelectData: [],
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
                this.$axios.get("/mem/teac/getColMajorTree").then(res => {
                    this.collegeClassTree = res.data.data
                    this.casData = this.getTreeData(res.data.data)
                })
            },

            getMajorTeacherList() {
                this.$axios.get("/mem/teac/getMajorTeacList", {
                    params: {
                        teacherName: this.searchForm.teacherName,
                        majorId: this.searchForm.majorId,
                        current: this.current,
                        size: this.size
                    }
                }).then(res => {
                    this.tableData = res.data.data.records
                    this.total = res.data.data.total
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            handleNodeClick(data) {
                if(this.nowShow.length == 0) {
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
                        if(this.nowShow.length <= 0 || this.nowShow[this.nowShow.length - 1].collegeId == 0) {
                            this.nowShow = []
                            break
                        }
                    }
                    if(this.nowShow.length > 0) {
                        this.nowShow.pop()
                    }
                    this.nowShow.push(data)
                }

                if(data.type == 1) {
                    this.searchForm.majorId = data.id
                    this.getMajorTeacherList()
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
                console.log(this.current)
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

            addStuHandle(formName) {
                this.$refs[formName].validate((valid)=> {
                    if(valid) {
                        this.addStudentForm.classId = this.addStudentForm.casSelectData[this.addStudentForm.casSelectData.length - 1]

                        let postData = []
                        postData.push(this.addStudentForm)
                        this.$axios.post('/mem/stu/addStuInClass', postData).then(res => {
                            if(res.data.code == 200) {
                                this.$notify({
                                    showClose: true,
                                    message: '添加学生<' + this.addStudentForm.studentName + '>成功',
                                    type: 'success'
                                });
                                this.getClassStudentList()
                                this.addStudentForm = {}
                                this.addStudentDig = false
                            }
                        })
                    }
                })
            },
            delHandle(select) {
                if(select != null) {
                    this.multipleSelection.push(select)
                    this.$axios.post('/mem/stu/delete', this.multipleSelection).then(res => {
                        if(res.data.code == 200) {
                            this.getClassStudentList()
                            this.multipleSelection = []
                            this.$notify({
                                showClose: true,
                                message: '删除成功',
                                type: 'success'
                            });
                        }
                    })

                } else {
                    let _this  = this
                    this.$confirm('此操作将永久删除所选成员, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {

                        _this.$axios.post('/mem/stu/delete', _this.multipleSelection).then(res => {
                            if(res.data.code == 200) {
                                this.getClassStudentList()
                                this.$notify({
                                    showClose: true,
                                    message: '批量删除成功',
                                    type: 'success'
                                });
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
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