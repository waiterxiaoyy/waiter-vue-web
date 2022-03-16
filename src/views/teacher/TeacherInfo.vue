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
                                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="editDig = true" v-if="hasAuth('mem:teac:add')">新增教师</el-button>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="warning" icon="" @click="showFuture" v-if="hasAuth('mem:teac:add')">导入名单</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="info" icon="el-icon-user" :disabled="multiSelStatu" v-if="hasAuth('sys:user:dist')" @click="distributeTeacUser(null)">分配用户</el-button>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="danger" icon="el-icon-error" :disabled="multiSelStatu" v-if="hasAuth('mem:teac:delete')" @click="delHandle(null)">批量删除</el-button>
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
                                label="教师姓名"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="teacherId"
                                label="教师ID"
                                width="100">
                        </el-table-column>
                        <el-table-column
                                prop="identity"
                                label="教师身份" width="200px">
                            <template slot-scope="scope">
                                <el-tag size="small" type="warning" v-for="item in scope.row.identity" :key="item" style="margin-right:2px;margin-top: 2px;">{{item}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="beginTime"
                                width="140"
                                label="入职时间">
                        </el-table-column>

                        <el-table-column
                                fixed="right"
                                label="操作">
                            <template slot-scope="scope">
                                <el-button @click="" type="text" size="small">查看</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" size="small" @click="distributeTeacUser(scope.row)">分配用户</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" size="small" @click="distributeClass(scope.row)">分配班级</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <template>
                                    <el-popconfirm title="此操作为危险操作，确定删除吗？" @confirm="delHandle(scope.row)">
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

        <el-dialog title="编辑" :visible.sync="editDig" width="30%" >
            <el-form :model="editForm" :rules="formRules" ref="editForm" width="30%" label-width="80px">
                <el-form-item label="选择专业" prop="casSelectData">
                    <el-cascader
                            :disabled="changeClass"
                            width="100%"
                            style="width: 100%;"
                            v-model="editForm.casSelectData"
                            :options="casData"
                            placeholder="请选择要导入的班级"
                            :props="optionProps"
                            @change="handleChange">
                    </el-cascader>
                    <el-switch
                            v-model="changeClass"
                            inactive-text="修改班级">
                    </el-switch>
                </el-form-item>
                <el-form-item label="教师ID" prop="teacherId">
                    <el-input v-model="editForm.teacherId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="教师姓名" prop="teacherName">
                    <el-input v-model="editForm.teacherName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="入职时间" prop="beginTime">
                    <el-date-picker
                            v-model="editForm.beginTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="教师类型" prop="identity">
                    <el-select v-model="editForm.identity" multiple placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="当前状态" prop="statu" >
                    <el-radio-group v-model="editForm.statu">
                        <el-radio :label=0>禁用</el-radio>
                        <el-radio :label=1>正常</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDig = false">取 消</el-button>
                <el-button type="primary" @click="editTeacHandle('editForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="分配班级" :visible.sync="distDig" width="30%" >
            <el-form :model="distForm">

                <el-tree
                        :data="termCourseList"
                        show-checkbox
                        ref="termCourseList"
                        :default-expand-all=false
                        node-key="id"
                        :check-strictly=true
                        :props="defaultDistProps">
                </el-tree>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="distDig = false">取 消</el-button>
                <el-button type="primary" @click="submitDistClass('distForm')">确 定</el-button>
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

                editDig: false,

                editForm: {},

                formRules: {
                    casSelectData: [
                        {required: true, message: '请选择专业',trigger: 'blur'},
                        {type: 'array',message: '请选择专业',trigger: ['blur', 'change']}
                    ],
                    teacherId: [
                        {required: true, message: '请输入8位工号', trigger: 'blur'},
                        {min: 8, max: 8, message: '请输入8位工号', trigger: 'blur'}
                    ],
                    teacherName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                    beginTime: [
                        {required: true, message: '请选择入职时间',trigger: 'blur'},
                    ],
                    statu: [
                        {required: true, message: '请选择当前状态',trigger: 'blur'},
                    ],

                },

                optionProps: {
                    value: 'id',
                    label: 'label',
                    children: 'children'
                },// 格式化工单信息
                casData: [],
                casSelectData: [],
                options: [{
                    value: '博士生导师',
                    label: '博士生导师'
                }, {
                    value: '硕士生导师',
                    label: '硕士生导师'
                }, {
                    value: '教授',
                    label: '教授'
                }, {
                    value: '副教授',
                    label: '副教授'
                }, {
                    value: '讲师',
                    label: '讲师'
                }, {
                    value: '助教',
                    label: '助教'
                }],
                changeClass: false,

                distDig: false,
                distForm: {},
                termCourseList: [],
                defaultDistProps: {
                    children: 'children',
                    label: 'name'
                },
            }
        },
        created() {
            this.getClassTree();
            this.getTermCourseList();
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            getTermCourseList() {
                this.$axios.get("/course/getTermCourse").then(res=> {
                    this.termCourseList = res.data.data;
                })
            },
            getClassTree() {
                this.$axios.get("/mem/teac/getColMajorTree").then(res => {
                    this.collegeClassTree = res.data.data;
                    this.casData = this.getTreeData(res.data.data)
                })
            },
            editHandle(scopeRow) {
                this.$axios.get('/mem/teac/getTeacById/' + scopeRow.teacherId).then(res => {
                    this.editForm = res.data.data;
                    this.editForm.casSelectData = [];
                    this.editForm.casSelectData.push(res.data.data.majorId);
                    this.editDig = true;
                    this.changeClass = true;
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
                    this.tableData = res.data.data.records;
                    console.log(this.tableData)
                    this.total = res.data.data.total;
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

            editTeacHandle(formName) {
                this.$refs[formName].validate((valid)=> {
                    if(valid) {
                        this.editForm.majorId = this.editForm.casSelectData[this.editForm.casSelectData.length - 1]

                        if(this.editForm.id) {
                            this.$axios.post('/mem/teac/updateTeac', this.editForm).then(res => {
                                if(res.data.code == 200) {
                                    this.$notify({
                                        showClose: true,
                                        message: '更新成功',
                                        type: 'success'
                                    });
                                    this.getMajorTeacherList();
                                    this.editForm = {};
                                    this.editDig = false;
                                }
                            })
                        } else {
                            this.$axios.post('/mem/teac/addTeacher', this.editForm).then(res => {
                                if(res.data.code == 200) {
                                    this.$notify({
                                        showClose: true,
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    this.getMajorTeacherList();
                                    this.editForm = {};
                                    this.editDig = false
                                }
                            })
                        }
                    }
                })
            },
            distributeTeacUser(select) {
                if (select != null) {
                    this.multipleSelection.push(select)
                    let _this = this
                    this.$confirm('此操作将分配此人员使用系统 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        _this.$axios.post('/sys/user/distributeTeacUser', this.multipleSelection).then(res => {
                            if (res.data.code == 200) {
                                this.getMajorTeacherList()
                                this.multipleSelection = []
                                this.$notify({
                                    showClose: true,
                                    message: '分配用户成功',
                                    type: 'success'
                                });
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消分配'
                        });
                    });

                } else {
                    let _this = this
                    this.$confirm('此操作将分配此人员使用系统, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        _this.$axios.post('/sys/user/distributeTeacUser', _this.multipleSelection).then(res => {
                            if (res.data.code == 200) {
                                this.getMajorTeacherList()
                                this.$notify({
                                    showClose: true,
                                    message: '批量分配用户成功',
                                    type: 'success'
                                });
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消分配'
                        });
                    });
                }
            },

            distributeClass(scopeRow) {
                this.$axios.get("/mem/teac/dist/" + scopeRow.id).then(res => {

                    this.distForm = res.data.data;
                    this.distDig = true;
                    this.$nextTick(function() {
                        this.$refs.termCourseList.setCheckedKeys(res.data.data.classIds)
                    })

                })

            },
            submitDistClass(formName) {
                var classIds = this.$refs.termCourseList.getCheckedKeys()

                this.$axios.post('/mem/teac/dist/submit/' + this.distForm.id, classIds).then(res => {
                    this.getMajorTeacherList();
                    this.$notify({
                        showClose: true,
                        message: '分配班级成功',
                        type: 'success'
                    });
                    this.distDig = false;
                    this.resetForm(formName);

                })
            },

            delHandle(select) {
                if(select != null) {
                    this.multipleSelection.push(select)
                    this.$axios.post('/mem/teac/delete', this.multipleSelection).then(res => {
                        if(res.data.code == 200) {
                            this.getMajorTeacherList()
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

                        _this.$axios.post('/mem/teac/delete', _this.multipleSelection).then(res => {
                            if(res.data.code == 200) {
                                this.getMajorTeacherList()
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