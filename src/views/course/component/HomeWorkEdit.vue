<template>
    <el-dialog title="编辑作业"
               :visible.sync="homeworkEditDig" width="1000px"
               :before-close="handleBeforeClose">
        <el-row :gutter="15">

            <el-col :span="8">
                <el-form ref="editHomeWordForm" :model="editHomeWorkForm" label-width="80px">
                    <el-form-item label="作业标题">
                        <el-input style="width: 100%" v-model="editHomeWorkForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-date-picker
                                style="width: 100%"
                                v-model="editHomeWorkForm.beginTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker
                                style="width: 100%"
                                v-model="editHomeWorkForm.endTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="收集状态">
                        <el-radio-group v-model="editHomeWorkForm.statu">
                            <el-radio-button label="1">截止</el-radio-button>
                            <el-radio-button label="0">收集</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-upload
                                class="upload-demo"
                                action="#"
                                :auto-upload="false"
                                :on-change="handleChange"
                                :on-remove="handleRemove"
                                :before-remove="beforeRemove"
                                multiple
                                :limit="3"
                                :on-exceed="handleExceed"
                                :file-list="fileList">
                            <el-button size="small" type="primary">上传文件</el-button>
                            <div slot="tip" class="el-upload__tip">不超过100MB</div>
                        </el-upload>
                    </el-form-item>




                </el-form>
            </el-col>

            <el-col :span="16">
                <div class="edit-header">
                    <div class="edit-header-title">
                        <span>编辑作业内容</span>
                    </div>
                    <div class="edit-header-handler">
                        <el-button type="primary" size="small">保存</el-button>
                    </div>
                </div>
                <MyQuillEditor :value="editHomeWorkForm.content" @input="handleEditorChange"></MyQuillEditor>
            </el-col>
        </el-row>

    </el-dialog>

</template>

<script>
    import MyQuillEditor from "../../../components/quill/MyQuillEditor";

    export default {
        name: "HomeWorkEdit",
        props: {
            homeworkEditDig: {
                type: Boolean
            },
            homeworkId: {
                type: String
            },
            isNew: {
                type: Boolean
            }
        },
        components: {
            MyQuillEditor
        },
        mounted() {
            if (this.isNew == true) {
                console.log(11)
                this.editHomeWorkForm = {
                    title: '',
                    content: '',
                    fileList: '',
                    beginTime: '',
                    endTime: '',
                    statu: 1
                }
            }
        },
        data() {
            return {
                editHomeWorkForm: {},
                uploadFileUrl: this.$MyComm.baseURL + '/m',
                uploadHeaders: {
                    Authorization: localStorage.getItem('token')
                },
                fileList: [],
                readyUploadFile: []
            }
        },
        watch: {
            homeworkEditDig: {
                handler(newValue) {
                    this.homeworkEditDig = newValue
                }
            },
            homeworkId: {
                handler(newValue) {
                    this.homeworkId = newValue
                }
            },
            isNew: {
                handler(newValue) {
                    this.isNew = newValue
                    this.editHomeWorkForm = {
                        title: '',
                        content: '',
                        fileList: {},
                        beginTime: '',
                        endTime: '',
                        statu: 1
                    }
                }
            }

        },
        methods: {
            handleBeforeClose() {
                this.$emit('update:homeworkEditDig', false)
                // this.$emit('update:isNew', false)
            },
            handleEditorChange(newValue) {
                this.editHomeWorkForm.content = newValue
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleChange(file, fileList) {
                console.log(fileList)
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            }
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

    .edit-header {
        position: relative;
        height: 45px;
    }

    .edit-header-title {
        float: left;
        font-size: 17px;
        font-weight: bold;
    }

    .edit-header-handler {
        float: right;
    }
</style>