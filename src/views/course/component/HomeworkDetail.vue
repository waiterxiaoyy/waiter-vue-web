<template>
    <el-dialog title="作业详情" width="1000px" :before-close="handleBeforeClose" :visible.sync="homeworkDetailDig">
        <el-row :gutter="15">

            <el-col :span="12">
                <el-form ref="editHomeWordForm" :model="editHomeWorkForm" label-width="80px">
                    <el-form-item label="作业标题">
                        <el-input :disabled="true" style="width: 100%" v-model="editHomeWorkForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-date-picker
                                :disabled="true"
                                style="width: 100%"
                                v-model="editHomeWorkForm.beginTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker
                                :disabled="true"
                                style="width: 100%"
                                v-model="editHomeWorkForm.endTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="收集状态">
                            <el-tag v-if="editHomeWorkForm.statu == 0" type="success" effect="dark" size="small"><i class="el-icon-loading"></i>正在收集</el-tag>
                            <el-tag v-if="editHomeWorkForm.statu == 1" type="danger" effect="dark" size="small">已截止</el-tag>

                    </el-form-item>
                    <el-form-item label="作业内容">
                        <div class="ql-editor">
                            <div v-html="editHomeWorkForm.content"></div>
                        </div>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12">
                <div style="margin-bottom: 5px">
                    <el-upload
                            class="upload-demo"
                            :action="submitHomeworkUrl"
                            name="homework"
                            :on-success="handleUploadSuccess"
                            :before-upload="beforeHomeworkUpload"
                            :data="uploadFileData"
                            :headers="uploadHeaders"
                            :on-change="handleChange">
                        <el-button size="small" type="primary" >提交作业</el-button>
                        <div slot="tip" class="el-upload__tip">不超过100MB</div>
                    </el-upload>
                </div>
                <el-table
                        :data="studentSubmit"
                        style="width: 100%">
                    <el-table-column
                            type="index"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            prop="studentId"
                            label="学生学号"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="studentName"
                            label="学生姓名" width="120">
                    </el-table-column>
                    <el-table-column
                            label="完成情况" width="80">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.statu == 0" type="info" effect="dark" size="small">未完成</el-tag>
                            <el-tag v-if="scope.row.statu == 1" type="success" effect="dark" size="small">已提交</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-if="hasAuth('course:home:submit')"
                            label="下载作业" width="80">
                        <template slot-scope="scope">
                            <el-button :disabled="scope.row.statu == 0" type="warning" icon="el-icon-download" circle></el-button>
                        </template>

                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
    export default {
        name: "HomeworkDetail",
        props: {
            homeworkDetailDig: {
                type: Boolean
            },
            homeworkId: {
                type: Number
            },
        },
        watch:{
            homeworkDetailDig: {
                handler(newValue) {
                    this.homeworkDetailDig = newValue;
                    if(this.homeworkDetailDig == true) {
                        this.getHomeWorkById(this.homeworkId);
                        this.getSubmitInfo(this.homeworkId);
                    }
                }
            },
            homeworkId: {
                handler(newValue) {
                    this.homeworkId = newValue
                }
            },
        },
        data() {
            return{
                editHomeWorkForm: {},
                studentSubmit: {},
                submitHomeworkUrl: this.$MyComm.baseURL + '/file/upload/homework',
                uploadHeaders: {
                    Authorization: localStorage.getItem('token')
                },
                uploadFileData:{
                    homeworkId: 0,
                    studentId: '18251104103'
                }
            }
        },
        methods: {
            handleBeforeClose() {
                this.$emit('update:homeworkDetailDig', false)
            },
            getHomeWorkById(id) {
                this.$axios.get('/homework/getHomeWorkById/' + id).then(res=>{
                    this.editHomeWorkForm = res.data.data;
                })
            },
            handleChange(file, fileList) {
                console.log(fileList)
            },
            getSubmitInfo(id) {
                this.$axios.get('/homework/getSubmitInfo/' + id).then(res=>{
                    this.studentSubmit = res.data.data;
                })
            },
            beforeHomeworkUpload(file) {
                this.uploadFileData.homeworkId = this.homeworkId;
            },
            handleUploadSuccess(res, file, fileList) {
                if(res.code == 200) {
                    this.$notify({
                        showClose: true,
                        message: '提交成功',
                        type: 'success',
                    });
                    this.getSubmitInfo(this.homeworkId);
                }
            },

        }
    }
</script>

<style scoped>
    /deep/ .el-upload {
        display: inline;
        text-align: center;
        cursor: pointer;
        outline: 0;
    }

    /deep/ .upload-demo {
        display: inline;
    }
</style>