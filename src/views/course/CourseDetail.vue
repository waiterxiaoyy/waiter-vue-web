<template>
    <div class="container">
        <el-page-header @back="goBack" content="班级详情">
        </el-page-header>

        <el-row :gutter="20">
            <el-col :span="14">
                <el-row>
                    <div class="course-abt">
                        <div class="course-title">
                            {{courseInfo.name}}
                        </div>

                        <div class="course-info">
                            <span><i class="el-icon-s-custom"></i> {{teacherInfo.teacherName}}</span><el-divider direction="vertical"></el-divider>
                            <span><i class="el-icon-orange"></i> {{studentList.length}}人</span>
                        </div>
                        <el-divider></el-divider>
                    </div>
                </el-row>
                <el-row>
                    <div class="course-manage">
                        <el-tabs v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane label="课程详情" name="first">
                                <div class="course-desc">
                                    <div class="course-desc-title">
                                        课程简介
                                    </div>
                                    <div class="course-desc-info">
                                        {{courseInfo.description}}
                                    </div>
                                </div>

                                <div class="course-desc">
                                    <div class="course-desc-title">
                                        课程教学
                                    </div>
                                    <div class="course-desc-info">
                                        <div class="course-detail-desc-info-avatar">
                                            <el-avatar :size="80" :src="courseInfo.image"></el-avatar>
                                        </div>
                                        <div class="course-detail-desc-info-abt">
                                            <div class="course-detail-desc-info-abt-desc">
                                                <div class="course-detail-desc-info-abt-desc-tittle">开课学院: </div>
                                                <div class="course-detail-desc-info-abt-desc-info">{{courseInfo.college}}</div>
                                            </div>
                                            <div class="course-detail-desc-info-abt-desc">
                                                <div class="course-detail-desc-info-abt-desc-tittle">任课教师: </div>
                                                <div class="course-detail-desc-info-abt-desc-info">{{teacherInfo.teacherName}}</div>
                                            </div>
                                            <div class="course-detail-desc-info-abt-desc">
                                                <div class="course-detail-desc-info-abt-desc-tittle">教师描述: </div>
                                                <div class="course-detail-desc-info-abt-desc-info">JavaEE开发与教学多年，精通JavaEE技术体系，对流行框架JQuery、DWR、Struts1/2，Hibernate，Spring，MyBatis、JBPM、Lucene等有深入研究。授课逻辑严谨，条理清晰，注重学生独立解决问题的能力。</div>
                                            </div>
                                            <div class="course-detail-desc-info-abt-desc">
                                                <div class="course-detail-desc-info-abt-desc-tittle">导师类别: </div>
                                                <div class="course-detail-desc-info-abt-desc-info">{{teacherInfo.identityStr}}</div>
                                            </div>
                                            <div class="course-detail-desc-info-abt-desc">
                                                <div class="course-detail-desc-info-abt-desc-tittle">联系方式: </div>
                                                <div class="course-detail-desc-info-abt-desc-info">waiterxiaoyy@qq.com</div>
                                            </div>

                                        </div>
                                    </div>
                                </div>



                            </el-tab-pane>
                            <el-tab-pane label="作业情况" name="second">
                                <!--操作栏 begin-->
                                <div class="handle-box">
                                    <el-form :inline="true">
                                        <el-form-item>
                                            <el-input
                                                    v-model="searchForm.query"
                                                    placeholder="作业标题"
                                                    clearable
                                            >
                                            </el-input>
                                        </el-form-item>

                                        <el-form-item>
                                            <el-button @click="" icon="el-icon-search" @click="getHomeworkList">搜索</el-button>
                                        </el-form-item>

                                        <el-form-item>
                                            <el-button type="primary" @click="handleHomeWorkEdit(true, 0)" v-if="hasAuth('sys:user:save')" icon="el-icon-circle-plus-outline">新增</el-button>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="warning" icon="el-icon-refresh" @click="getHomeworkList" >刷新</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <div class="teacher-course-homework-table">
                                    <el-table
                                            :data="homeworkTable"
                                            style="width: 100%">
                                        <el-table-column type="expand">
                                            <template slot-scope="props">
                                                <el-form label-position="left" inline class="demo-table-expand">
                                                    <el-form-item label="开始收集时间">
                                                        <span>{{ props.row.beginTime }}</span>
                                                    </el-form-item>
                                                    <el-form-item label="创建时间">
                                                        <span>{{ props.row.created }}</span>
                                                    </el-form-item>
                                                </el-form>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                label="状态"
                                                align="center"
                                                :filters="[{text: '正在收集', value: 1}, {text: '已截止', value: 0}]"
                                                :filter-method="filterHandler">
                                            <template slot-scope="scope">
                                                <el-tag v-if="scope.row.statu == 0" type="success" effect="dark" size="small"><i class="el-icon-loading"></i>正在收集</el-tag>
                                                <el-tag v-if="scope.row.statu == 1" type="danger" effect="dark" size="small">已截止</el-tag>
                                            </template>
                                        </el-table-column>

                                        <el-table-column
                                                prop="title"
                                                label="作业标题">
                                        </el-table-column>
                                        <el-table-column
                                                prop="endTime"
                                                label="截止时间">
                                        </el-table-column>
                                        <el-table-column
                                                label="操作"
                                                width="220"
                                                align="center">
                                            <template slot-scope="scope">
                                                <el-button type="text" v-if="hasAuth('course:home:edit')" @click="handleHomeWorkEdit(false,scope.row.id)">编辑</el-button>
                                                <el-divider direction="vertical" v-if="hasAuth('course:home:edit')"></el-divider>
                                                <el-button type="text" @click="handleHomewordDetail(scope.row.id)">完成情况</el-button>
                                                <el-divider direction="vertical" v-if="hasAuth('course:home:delete')"></el-divider>

                                                <template>
                                                    <el-popconfirm title="此操作为危险操作，确认删除吗？" confirm-button-text="确认" cancel-button-text="取消" @confirm="delHomeworkHandle(scope.row.id)">
                                                        <el-button type="text" slot="reference" v-if="hasAuth('course:home:delete')">删除</el-button>
                                                    </el-popconfirm>
                                                </template>

                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="考勤情况" name="third">
                                <!--操作栏 begin-->
                                <div class="handle-box">
                                    <el-form :inline="true">
                                        <el-form-item>
                                            <el-input
                                                    v-model="searchForm.query"
                                                    placeholder="考勤标题"
                                                    clearable
                                            >
                                            </el-input>
                                        </el-form-item>

                                        <el-form-item>
                                            <el-button @click="" icon="el-icon-search" @click="getAttendanceList">搜索</el-button>
                                        </el-form-item>

                                        <el-form-item>
                                            <el-button type="primary" @click="handleAttendanceEdit(true, 0)" v-if="hasAuth('attendance:course:add')" icon="el-icon-circle-plus-outline">新增</el-button>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="warning" icon="el-icon-refresh" @click="getAttendanceList" >刷新</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <div class="teacher-course-homework-table">
                                    <el-table
                                            :data="attendanceList"
                                            style="width: 100%">
                                        <el-table-column type="expand">
                                            <template slot-scope="props">
                                                <el-form label-position="left" inline class="demo-table-expand">
                                                    <el-form-item label="开始收集时间">
                                                        <span>{{ props.row.beginTime }}</span>
                                                    </el-form-item>
                                                    <el-form-item label="创建时间">
                                                        <span>{{ props.row.created }}</span>
                                                    </el-form-item>
                                                </el-form>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                label="状态"
                                                align="center"
                                                :filters="[{text: '正在考勤', value: 1}, {text: '已截止', value: 0}]"
                                                :filter-method="filterHandler">
                                            <template slot-scope="scope">
                                                <el-tag v-if="scope.row.statu == 0" type="success" effect="dark" size="small"><i class="el-icon-loading"></i>正在收集</el-tag>
                                                <el-tag v-if="scope.row.statu == 1" type="danger" effect="dark" size="small">已截止</el-tag>
                                            </template>
                                        </el-table-column>

                                        <el-table-column
                                                prop="title"
                                                label="考勤标题">
                                        </el-table-column>
                                        <el-table-column
                                                prop="endTime"
                                                label="截止时间">
                                        </el-table-column>
                                        <el-table-column
                                                label="操作"
                                                width="220"
                                                align="center">
                                            <template slot-scope="scope">
                                                <el-button type="text" @click="handleAttendanceEdit(false,scope.row.id)" v-if="hasAuth('attendance:course:add')">编辑</el-button>
                                                <el-divider direction="vertical" v-if="hasAuth('attendance:course:add')"></el-divider>
                                                <el-button type="text" @click="handleAttendanceDetail(scope.row.id)">完成情况</el-button>
                                                <el-divider direction="vertical" v-if="hasAuth('attendance:course:add')"></el-divider>

                                                <template>
                                                    <el-popconfirm title="此操作为危险操作，确认删除吗？" confirm-button-text="确认" cancel-button-text="取消" @confirm="deleteAttendance(scope.row.id)">
                                                        <el-button type="text" slot="reference" v-if="hasAuth('attendance:course:add')">删除</el-button>
                                                    </el-popconfirm>
                                                </template>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="班级成员" name="fourth">
                                <el-table
                                        :data="studentList"
                                        style="width: 100%">
                                    <el-table-column
                                        type="index"
                                    width="50">
                                    </el-table-column>
                                    <el-table-column
                                            prop="studentId"
                                            label="学生学号"
                                    width="200">
                                    </el-table-column>
                                    <el-table-column
                                            prop="studentName"
                                            label="学生姓名" width="200">
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-row>
            </el-col>
            <el-col :span="10">
                <div class="comment-bd"  style="overflow:auto">
                    <div class="comment-header">
                        <span>讨论区</span>
                        <el-divider></el-divider>
                    </div>
                    <div class="comment-main" >
                        <div v-if="commentList.length <= 0">

                            <el-empty  description="暂无评论"></el-empty>
                        </div>
                        <template v-for="comment in commentList">
                            <div class="comment-item">
                                <div class="comment-user">
                                    <div class="comment-user-avatar">
                                        <el-avatar :size="30" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
                                    </div>
                                    <div class="comment-user-name">
                                        {{comment.nickname}}
                                    </div>
                                    <div class="comment-user-time">
                                        {{comment.created}}
                                    </div>
                                </div>
                                <div class="comment-content">
                                    <div class="ql-editor">
                                        <div v-html="comment.content"></div>
                                    </div>
                                </div>
                                <div class="comment-handle">
                                    <el-button style="margin-right: 3px" type="text" v-if="hasAuth('course:home:comment:reply')" @click="replyComment(comment.id)">回复 </el-button>
                                    <el-divider direction="vertical"></el-divider>
                                    <el-button style="margin-left: 3px;margin-right: 3px" type="text" v-if="hasAuth('course:home:comment:delete')" @click="deleteComment(comment.id)"> 删除</el-button>
<!--                                    <el-divider direction="vertical"></el-divider>-->
<!--                                    <el-button style="margin-left: 3px" type="text"> 禁出</el-button>-->
                                </div>
                            </div>


                            <template v-if="comment.children.length > 0">
                                <el-divider><span style="color: #20b2aa">以下是老师回复</span></el-divider>
                                <template v-for="subCmoment in comment.children">
                                    <div class="comment-subItem">

                                        <div class="comment-item">
                                            <div class="comment-user">
                                                <div class="comment-user-avatar">
                                                    <el-avatar :size="30" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
                                                </div>
                                                <div class="comment-user-name">
                                                    {{subCmoment.nickname}}
                                                </div>
                                                <div class="comment-user-time">
                                                    {{subCmoment.created}}
                                                </div>
                                            </div>
                                            <div class="comment-content">
                                                <div class="ql-editor">
                                                    <div v-html="subCmoment.content"></div>
                                                </div>
                                            </div>
                                            <div class="comment-handle">
                                                <el-button style="margin-right: 3px" type="text" v-if="hasAuth('course:home:comment:delete')" @click="deleteComment(subCmoment.id)"> 删除</el-button>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                            <el-divider></el-divider>
                        </template>
<!--                        <el-pagination-->
<!--                                background-->
<!--                                :page-sizes="[10, 20, 50, 100]"-->
<!--                                :page-size="10"-->
<!--                                layout="sizes, prev, pager, next"-->
<!--                                :total="1000"-->
<!--                                :pager-count="4">-->
<!--                        </el-pagination>-->

                    </div>

                    <div class="comment-editor">
                        <div v-if="commentShow == true">
                            <MyQuillEditor :value="commentEditForm.content" @input="handleEditorChange"></MyQuillEditor>
                        </div>
                        <el-button style="margin: 5px 5px 0 5px;" type="success" @click="submitComment">发布评论</el-button>
                    </div>
                </div>

            </el-col>
        </el-row>
        <HomeWorkEdit :homeworkEditDig.sync="homeworkEditDig" :homeworkId.sync="homeworkId" :isNew.sync="isNew" :classId="classId"></HomeWorkEdit>
        <HomeworkDetail :homeworkDetailDig.sync="homeworkDetailDig" :homeworkId.sync="homeworkId"></HomeworkDetail>

        <AttendanceInfo :attendanceInfoDig.sync="attendanceInfoDig" :attendanceId.sync="attendanceId"></AttendanceInfo>
        <el-dialog
                title="创建考勤"
                :visible.sync="attendanceDig"
                width="30%"
                :before-close="handleClose">
                <el-form ref="attendanceForm" label-width="80px">
                    <el-form-item label="考勤标题">
                        <el-input style="width: 100%" v-model="editAttendanceForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-date-picker
                                style="width: 100%"
                                v-model="editAttendanceForm.beginTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker
                                style="width: 100%"
                                v-model="editAttendanceForm.endTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="收集状态">
                        <el-radio-group v-model="editAttendanceForm.statu">
                            <el-radio-button label="1">截止</el-radio-button>
                            <el-radio-button label="0">考勤</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="attendanceDig = false">取 消</el-button>
            <el-button type="primary" @click="editAttendance">确 定</el-button></span>
        </el-dialog>
    </div>
</template>

<script>
    import MyQuillEditor from "../../components/quill/MyQuillEditor";
    import HomeWorkEdit from "./component/HomeWorkEdit";
    import HomeworkDetail from "./component/HomeworkDetail";
    import AttendanceInfo from "./component/AttendanceInfo";
    import myMixin from "../../globalFun";
    export default {
        name: "CourseDetail",
        components: {AttendanceInfo, HomeworkDetail, HomeWorkEdit, MyQuillEditor},
        mixins: [myMixin],
        data() {
            return {
                courseId: 0,
                classId: 0,
                courseInfo:{},
                teacherInfo: {},
                studentList: {},

                activeName: 'first',
                homeworkTable: [],
                delBtlStatu: true,
                searchForm: {},
                dialogVisible: false,
                count: 2,
                commentEditForm: {
                    parentId: 0,
                    content: '默认内容',
                    commentId: '',
                    userId: '',
                    classId: '',
                    statu: 1,
                    type: 0
                },
                homeworkEditDig: false,
                homeworkId: 0,
                isNew: true,

                homeworkDetailDig: false,

                commentList:[],
                commentShow: false,

                attendanceDig: false,
                attendanceList: [],
                editAttendanceForm: {
                    title: '',
                    statu: 0,
                    beginTime: '',
                    endTIme: '',
                    classId: ''
                },
                attendanceInfoDig: false,
                attendanceId: 0
            }
        },
        created() {
            this.courseId = Number(this.$route.query.courseId);
            this.classId = Number(this.$route.query.classId);
            this.courseHandler(this.courseId);
            this.teacherHandler(this.classId);
            this.getHomeworkList();
            this.homeworkEditDig = false;
            this.getClassComment();
            this.getAttendanceList();
            this.attendanceInfoDig = false;
        },
        methods: {
            goBack() {
                if(!this.hasAuth('course:manage:set')) {
                    this.$router.push('/course/myCourse')
                } else {
                    this.$router.push('/course/courseset');
                }

            },
            async courseHandler(id) {
                const{data: res} = await this.$axios.get("/course/getCourseById/" + id);
                const{data: res1} = await this.$axios.get("/course/getTermById/" + res.data.parentId);
                const{data: res2} = await this.$axios.get("/course/getCourseCollege/" + res.data.collegeId);
                this.courseInfo = res.data;
                this.courseInfo.image = this.$MyComm.baseURL + this.courseInfo.image;
                this.courseInfo.term = res1.data.name;
                this.courseInfo.college = res2.data.name;
            },
            async teacherHandler(classId) {
                const{data: res} = await this.$axios.get("/mem/teac/getTeacherByClassId/" + classId);

                const{data: res1} = await this.$axios.get("/course/getClassStudent/" + classId);
                this.teacherInfo = res.data;
                this.studentList = res1.data;
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            filterHandler (value, row) {
                return row.row === value
            },
            handleEditorChange(newValue) {
                this.commentEditForm.content = newValue
            },
            handleHomeWorkEdit(isNew, homeworkId) {
                this.homeworkId = homeworkId;
                this.isNew = isNew;
                this.homeworkEditDig = true
            },
            async getHomeworkList() {
                const{data: res} = await this.$axios.get('/homework/getHomeworkByClassId/', {
                    params: {
                        title: this.searchForm.query,
                        classId: this.classId
                    }
                })
                this.homeworkTable = res.data;
            },
            delHomeworkHandle(id) {
                this.$axios.get("/homework/delete/" + id).then(res=> {
                    this.$notify({
                        showClose: true,
                        message: '删除成功',
                        type: 'success',
                    });
                })
            },
            handleHomewordDetail(id) {
                this.homeworkId = id;
                this.homeworkDetailDig = true;
            },

            handleClose() {
                this.attendanceDig = false
            },

            async getAttendanceList() {
                const{data: res} = await this.$axios.get('/attendance/course/getAttendanceList/', {
                    params: {
                        title: this.searchForm.query,
                        classId: this.classId
                    }
                })
                this.attendanceList = res.data;
            },
            handleAttendanceEdit(isNew, attendanceId) {
                this.attendanceDig = true;

                if(isNew == true) {
                    this.editAttendanceForm = {}
                } else {
                    this.getAttendanceById(attendanceId)
                }
            },
            async editAttendance() {

                this.editAttendanceForm.classId = this.classId;
                if (this.editAttendanceForm.id) {
                    const {data: res} = await this.$axios.post("/attendance/course/update", this.editAttendanceForm);
                } else {
                    const {data: res} = await this.$axios.post("/attendance/course/addAttendance", this.editAttendanceForm);
                }
                this.$notify({
                    showClose: true,
                    message: '操作成功',
                    type: 'success',
                });
                this.attendanceDig = false;
            },
            getAttendanceById(attendanceId) {
                this.$axios.get("/attendance/course/getAttendanceById/" + attendanceId).then(res=>{
                    this.editAttendanceForm = res.data.data
                })
            },
            deleteAttendance(id) {
                this.$axios.get("/attendance/course/delete/" + id).then(res=>{
                    this.$notify({
                        showClose: true,
                        message: "删除成功",
                        type: 'success',
                    });
                    this.getAttendanceList()
                })
            },

            handleAttendanceDetail(id) {
                console.log(111)
                this.attendanceId = id;
                this.attendanceInfoDig = true;
            },

            getClassComment(){
                this.$axios.get("/course/comment/getClassComment/" + this.classId).then(res=>{
                    this.commentList  = res.data.data
                })
            },
            replyComment(parentId) {
                if(this.commentShow == false) {
                    this.commentShow = true;
                }
                this.commentEditForm.parentId = parentId;
            },

            submitComment() {

                if(this.commentShow == false) {
                    this.commentShow = true;
                    return
                }
                this.commentEditForm.classId = this.classId
                // console.log(localStorage.getItem("user"))

                this.$axios.post("/course/comment/submit", this.commentEditForm).then(res=>{
                    this.$notify({
                        showClose: true,
                        message: '发布评论成功',
                        type: 'success',
                    });
                    this.getClassComment()
                })
            },
            deleteComment(id) {
                this.$axios.get("/course/comment/deleteComment/" + id).then(res=>{
                    this.$notify({
                        showClose: true,
                        message: '删除成功',
                        type: 'success',
                    });
                    this.getClassComment()
                })
            }

        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .course-abt {
        position: relative;
    }

    .course-title {
        font-weight: bold;
        font-size: 25px;
        margin: 20px 0 10px 0;
    }

    .course-info {
        font-size: 15px;
        color: #5f6978;
    }
    .course-manage {
        width: 100%;
    }

    .course-desc {
        display: flex;
        overflow: hidden;
        border: 1px solid #ebeef5;
        padding: 15px 0 15px 0;
        margin: 5px 0 10px 0;
    }

    .course-desc-title {
        width: 120px;
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-weight: bolder;
        font-size: 16px;
    }

    .course-desc-info {
        flex: 1;
        font-size: 10px;
        color: #666666;
        display: flex;
    }

    .course-detail-desc-info-avatar {
        text-align: center;
        top: 50%;
        margin-top: 30px;
    }

    .course-detail-desc-info-abt {
        flex: 1;
        margin-left: 10px;

    }

    .course-detail-desc-info-abt-desc {
        width: 100%;
        display: flex;
        margin: 10px 0 10px 0;
    }

    .course-detail-desc-info-abt-desc-tittle {
        font-size: 14px;
        width: 80px;
        font-weight: bold;
    }
    .course-detail-desc-info-abt-desc-info {
        flex: 1;
        font-size: 14px;
        padding-right: 1px;
    }

    .teacher-course-homework-table {
        width: 100%;
        margin-top:0.5cm;
    }

    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .el-button--primary.is-active,
    .el-button--primary:active {
        background: #20B2AA;
        border-color: #20B2AA;
        color: #fff;
    }

    .el-button--primary:focus,
     .el-button--primary:hover {
         background: #48D1CC;
         border-color: #48D1CC;
         color: #fff;
     }

    .el-button--primary {
        color: #FFF;
        background-color: #20B2AA;
        border-color: #20B2AA;
    }

    .comment-bd {
        width: 100%;
        min-height: 500px;
        border: 10px solid #f3f5f7;
        background-color: #ffffff;
    }

    .comment-header {
        display: flex;
        flex-direction: column;
    }

    .comment-header span {
        font-size: 18px;
        height: 45px;
        font-weight: bolder;
        color: #505762;
        line-height: 45px;
        margin-left: 10px;
    }

    .comment-header .el-divider {
        margin: 0;
    }

    .comment-main {
        position: relative;
    }

    .comment-item {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .comment-user {
        position: relative;
        width: 100%;
        height: 40px;
    }
    .comment-user-avatar {
        margin: 5px 10px 5px 10px;
        float: left;
    }

    .comment-user-name {
        width: 100px;
        height: 40px;
        float: left;
        line-height: 40px;
        overflow: hidden;
        font-size: 15px;
        color: #6c7787;
    }

    .comment-user-time {
        float: right;
        margin-right: 10px;
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        color: #5f6978;
    }

    .comment-content {
        width: 97.5%;
        margin: 0px 0px 5px 8px;
        font-family: "Microsoft Yahei", "Times New Roman", Arial, Helvetica, sans-serif;
        font-size: 14px;
    }
    .comment-handle {
        position: relative;
        text-align: right;
        margin-right: 5px;
    }

    .comment-main .el-divider {
        margin: 5px 0px 10px 0px;
    }

    .comment-subItem {
        width: 88%;
        margin-left: 55px;
        margin-bottom: 10px;
    }

    .comment-editor {
        height: 40px;
        padding-top: 15px;
    }




</style>