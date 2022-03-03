<template>
    <div class="app-contanier">
        <el-card>
            <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6" style="margin-bottom: 15px">
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
                <el-col :xs="24" :sm="24" :md="24"  :lg="8" :xl="8" style="margin-bottom: 15px">
                    <el-form ref="studentForm" :model="studentForm" label-width="80px">
                        <el-form-item label="学生姓名" prop="studentName">
                            <el-input v-model="studentForm.studentName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="学生学号" prop="studentId">
                            <el-input v-model="studentForm.studentId" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="warning" @click="checkStuSelect">人脸录入</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24"  :lg="10" :xl="10" style="margin-bottom: 15px">
                    <el-alert
                            :closable="false"
                            title="学生人脸数据"
                            type="warning"
                            description="如需更换或者新增人脸数据，请点击左方的人脸录入"
                            style="margin-bottom: 10px">
                    </el-alert>
                    <el-avatar
                        style="width: 350px; height: 350px"
                        shape="square"
                        :src="faceUrl" >

                        <div slot="placeholder" class="image-slot">
                            拼命加载中<span class="dot">...</span>
                        </div>

                        <div slot="error" class="image-slot">
                            <el-alert
                                    title="暂无人脸数据"
                                    type="error"
                                    :closable="false"
                                    show-icon>
                            </el-alert>
                        </div>
                    </el-avatar>
                </el-col>
            </el-row>

        </el-card>

        <el-dialog title="学生名单" :visible.sync="studentDig" width="400">
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
                </el-form>
            </div>
            <el-table
                    :data="studentList"
                    @row-click="studentSelect">
                <el-table-column property="studentName" label="学生姓名"></el-table-column>
                <el-table-column property="studentId" label="学生学号"></el-table-column>
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
        </el-dialog>
        <FaceUploadDrawer :faceDrawer.sync="faceDrawer" :studentForm.sync="studentForm" @getStuFace="getStuFace"></FaceUploadDrawer>

    </div>
</template>

<script>
    import FaceUploadDrawer from "./FaceUploadDrawer";
    export default {
        name: "FaceInput",
        components: {FaceUploadDrawer},
        data() {
            return {
                filterText: '',

                collegeClassTree: [],

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },

                studentForm: {
                    studentName: '',
                    studentId: '',
                    nowTime: ''
                },
                formRules:{
                    studentId: [
                        {required: true, message: '请输入11位学号', trigger: 'blur'},
                        {min: 11, max: 11, message: '请输入11位学号', trigger: 'blur'}
                    ],
                    studentName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                    nowTime: [
                        {required: true, message: '请选择日期', trigger: 'blur'}
                    ],
                },
                total: 0,
                size: 10,
                current: 1,

                searchForm: {},

                canvasShotDig: false,

                studentDig: false,
                studentList: [],
                faceDrawer: false,
                faceUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'

            };
        },
        created() {
            this.getClassTree()
        },
        mounted() {
            // this.init()
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods:{
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
                if(data.type == 2) {
                    this.searchForm.classId = data.id
                    this.getClassStudentList()
                }

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
                    this.studentDig = true
                    this.studentList = res.data.data.records
                    this.total = res.data.data.total
                })
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
            studentSelect(row, column,event) {
                this.studentForm = row
                this.getStuFace()
                this.studentDig = false
            },
            checkStuSelect() {
                if(this.studentForm.studentName == '' || this.studentForm.studentId == '') {
                    this.$notify({
                        title: '提示',
                        message: '请先选择学生',
                        type: 'warning'
                    })
                }
                else {
                    this.faceDrawer = true
                }
            },
            async getStuFace() {
                const{data: res } = await this.$axios.get('attendance/getStuFace/'+this.studentForm.studentId)

                if(res.code == 200) {
                    this.faceUrl = this.$MyComm.baseURL + res.data.faceUrl
                }

            }


        }
    }
</script>

<style scoped>

    .handle-box {

    }

    .image-none {
        font-size: larger;
        text-align: center;
        font-weight: bolder;
    }

</style>