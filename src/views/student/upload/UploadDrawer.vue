<template>
    <el-drawer
            title="导入名单"
            :visible.sync="uploadDrawer"
            direction="rtl"
            :before-close="handleClose">
        <div class="upload-warning">
            你需要选择一个要导入的班级，并上传指定格式的Excel表
        </div>
        <el-card class="upload-card">
            <el-cascader
                    v-model="casSelectData"
                    :options="casData"
                    placeholder="请选择要导入的班级"
                    :props="optionProps"
                    @change="handleChange" class="upload-cascader">
            </el-cascader>

            <el-upload
                    class="upload-body"
                    drag
                    ref="importFileUploader"
                    :action="uploadFileUrl"
                    :multiple="false"
                    :before-upload="beforeUpload"
                    :on-success="handleUploadSuccess"
                    name="file"
                    accept=".xls,.xlsx"
                    :data="upLoadData"
                    :headers="uploadHeaders"
                    :limit="1"
                    >
                <i class="el-icon-upload" ></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传excel文件，且不超过500kb</div>
            </el-upload>


        </el-card>
        <el-button style="margin:5px 10px 0 10px;width: 200px;" @click="tableDrawer = true" :disabled="btStatus" type="success" size="medium" round>检验数据</el-button>
        <TableDrawer :tableDrawer.sync="tableDrawer" :uploadData="this.upLoadData" :newList="newList" :existList="existList" @func="updateStatu"></TableDrawer>
    </el-drawer>
</template>

<script>
    import TableDrawer from "./TableDrawer";
    export default {
        name: "Drawer",
        components: {TableDrawer},
        props: {
            uploadDrawer: {
                type: Boolean,
            }
        },
        data() {
            return {
                // uploadDrawer: false,
                uploadFileUrl: this.$MyComm.baseURL + '/mem/stu/upload',

                uploadHeaders: {
                    Authorization: localStorage.getItem('token')
                },
                upLoadData: {},

                optionProps: {
                    value: 'id',
                    label: 'label',
                    children: 'children'
                },// 格式化工单信息
                casData: [],
                casSelectData: [],

                tableDrawer: false,

                newList: [],
                existList: [],
                btStatus: true
            }
        },
        created() {
            this.getClassTree()
        },
        watch: {
            uploadDrawer: {
                handler(newValue) {
                    this.uploadDrawer = newValue
                }
            }
        },
        methods: {
            handleClose() {
                this.$emit('update:uploadDrawer', false)
            },
            handleChange(value) {
                this.upLoadData.classId = value[value.length - 1]
                console.log(this.upLoadData.classId)
            },
            getClassTree() {
                this.$axios.get("/mem/stu/getcctree").then(res => {
                    this.casData = this.getTreeData(res.data.data)
                })
            },
            // 上传前对文件的大小的判断
            beforeUpload(file) {
                if(this.upLoadData.classId == undefined || this.upLoadData.classId == 0 || this.upLoadData.classId == '') {
                    this.$notify({
                        title: '提示',
                        message: '请先选择班级',
                        position: 'top-left',
                        type: "warning"
                    });
                    return false
                }
                const extension = file.name.split('.')[1] === 'xls'
                const extension2 = file.name.split('.')[1] === 'xlsx'
                const isLt50M = file.size / 1024 / 1024 < 50
                if (!extension && !extension2) {
                    this.$notify({
                        title: '提示',
                        message: '导入文件只支持xls和xlsx文件',
                        position: 'top-left',
                        type: "error"
                    });
                    this.$refs.importFileUploader.clearFiles()
                }
                if (!isLt50M) {
                    this.$notify({
                        title: '提示',
                        message: '导入文件小于50M',
                        position: 'top-left',
                        type: "error"
                    });
                    this.$refs.importFileUploader.clearFiles()
                    return false
                }
            },


            handleUploadSuccess(res, file, fileList) {
                if(res.code == 200) {
                    this.$notify({
                        title: '提示',
                        message: '请校验导入数据',
                        position: 'top-left',
                        type: "info"
                    });
                    this.btStatus = false
                    this.newList = res.data.newList
                    this.existList = res.data.existList
                    this.tableDrawer = true
                } else {
                    this.$notify({
                        title: '提示',
                        message: '文件格式出错',
                        position: 'top-left',
                        type: "error"
                    });
                }
            },
            updateStatu(data) {
                this.existList = []
                this.newList = []
              this.uploadDrawer = false
                this.$emit('update:uploadDrawer', false)
              this.$emit("func", "获取学生列表")
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
            }
        }
    }
</script>

<style scoped>
    .upload-card {

        margin: 5px 10px 10px 10px !important;

    }

    .upload-body {
        margin-left: 25px;
    }

    .upload-warning {
        text-align: left;
        color: #ffffff;
        padding: 8px 16px;
        background-color: #5977b5;
        border-radius: 4px;
        border-left: 8px solid #01355d;
        margin: 5px 10px 20px 10px;
    }

    .upload-cascader {
        width: 100%;
        height: 50px;
    }

</style>