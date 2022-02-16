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
                                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addStudentDig = true" v-if="hasAuth('mem:stu:add')">新增学生</el-button>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="warning" icon="el-icon-upload" v-if="hasAuth('mem:stu:add')" @click="uploadDrawer = true">批量导入</el-button>
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
        <UploadDrawer :uploadDrawer.sync="uploadDrawer"></UploadDrawer>

        <el-dialog title="新增学生" :visible.sync="addStudentDig" width="30%" >
            <el-form :model="addStudentForm" :rules="addStuFormRules" ref="addStudentForm" width="30%" label-width="80px">
                <el-form-item label="选择班级" prop="casSelectData">
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
                <el-form-item label="学号" prop="studentId">
                    <el-input v-model="addStudentForm.studentId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="studentName">
                    <el-input v-model="addStudentForm.studentName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addStudentDig = false">取 消</el-button>
                <el-button type="primary" @click="addStuHandle('addStudentForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import UploadDrawer from "./upload/UploadDrawer";
    export default {
        name: "StudentInfo",

        components: {UploadDrawer},
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
                multiSelStatu: true,

                uploadDrawer: false,

                addStudentDig: false,

                addStudentForm: {},

                addStuFormRules: {
                    casSelectData: [
                        {required: true, message: '请选择班级',trigger: 'blur'},
                        {type: 'array',message: '请选择班级',trigger: ['blur', 'change']}
                    ],
                    studentId: [
                        {required: true, message: '请输入11位学号', trigger: 'blur'},
                        {min: 11, max: 11, message: '请输入11位学号', trigger: 'blur'}
                    ],
                    studentName: [
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
                this.$axios.get("/mem/stu/getcctree").then(res => {
                    this.collegeClassTree = res.data.data
                    this.casData = this.getTreeData(res.data.data)
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
                        console.log(postData)
                        this.$axios.post('/mem/stu/addStuInClass', postData).then(res => {
                            if(res.data.code == 200) {
                                this.$notify({
                                    showClose: true,
                                    message: '添加学生<' + this.addStudentForm.studentName + '>成功',
                                    type: 'success'
                                });
                                this.addStudentForm = {}
                                this.addStudentDig = false
                            }
                        })
                    }
                })
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