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
                    <el-form ref="studentForm" :model="studentForm" label-width="80px" :rules="formRules">
                        <el-form-item label="学生姓名" prop="studentName">
                            <el-input v-model="studentForm.studentName"></el-input>
                        </el-form-item>
                        <el-form-item label="学生学号" prop="studentId">
                            <el-input v-model="studentForm.studentId"></el-input>
                        </el-form-item>
                        <el-form-item label="考勤时间" prop="nowTime">
                            <el-date-picker
                                    v-model="studentForm.nowTime"
                                    type="datetime"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="init">立即考勤</el-button>
                            <el-button @click="stopMediaStreamTrack">取 消</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24"  :lg="10" :xl="10" style="margin-bottom: 15px">
                    <el-row class="face-box">

                        <el-card class="video-box">
                            <div class="handle-box">
                                <el-form :inline="true">
                                    <el-form-item>
                                        <el-button type="warning" @click="openCamera">开启摄像头</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="info" @click="stopMediaStreamTrack">关闭摄像头</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button id="snap" type="success" @click="getImg">截取图像</el-button>
                                    </el-form-item>
                                </el-form>




                            </div>
                            <div slot="header" class="clearfix">
                                <span>获取人脸</span>
                            </div>
                            <video  ref="video"></video>
                        </el-card>
                    </el-row>
                </el-col>
            </el-row>

        </el-card>

        <el-dialog title="请确认人员数据" :visible.sync="canvasShotDig" width="400">
            <el-card>
                <div slot="header" class="clearfix">
                    <span>人脸截图及人员信息</span>
                </div>
                <el-row>
                    <el-col span="12">
                        <canvas width="300" height="200" ref="canvas"></canvas>
                    </el-col>
                    <el-col span="12">
                        <el-form ref="studentForm" :model="studentForm" label-width="80px" :rules="formRules">
                            <el-form-item label="学生姓名" prop="studentName">
                                <el-input v-model="studentForm.studentName"></el-input>
                            </el-form-item>
                            <el-form-item label="学生学号" prop="studentId">
                                <el-input v-model="studentForm.studentId"></el-input>
                            </el-form-item>
                            <el-form-item label="考勤时间" prop="nowTime">
                                <el-date-picker
                                        v-model="studentForm.nowTime"
                                        type="datetime"
                                        placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="success" @click="init">立即考勤</el-button>
                                <el-button @click="stopMediaStreamTrack">取 消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-card>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "FaceInput",
        data() {
            return {
                vaido: null,
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

                canvasShotDig: false

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

            openCamera(){
                this.$nextTick(() => {
                    var video = this.$refs.video;
                    this.video = video;
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        navigator.mediaDevices
                            .getUserMedia({
                                video: true
                            })
                            .then(function(stream) {
                                MediaStreamTrack =
                                    typeof stream.stop === "function"
                                        ? stream
                                        : stream.getTracks()[1];
                                video.srcObject = stream;
                                window.stream = stream;
                                video.play();
                            })
                            .catch(function(err) {
                                // console.log(err);
                            });
                    } else if (navigator.getMedia) {
                        navigator
                            .getMedia({
                                video: true
                            })
                            .then(function(stream) {
                                console.log(stream);
                                MediaStreamTrack = stream.getTracks()[1];
                                video.src = window.webkitURL.createObjectURL(stream);
                                video.play();
                            })
                            .catch(function(err) {
                                console.log(err);
                            });
                    }
                });
            },

            stopMediaStreamTrack() {

                if (typeof(window.stream) === "object") {
                    //	this.videoEl是视频流容器，也就是video标签，需要在data中声明这个变量，然后在打开摄像头的方法中this.videoEl.srcObject = window.stream
                    this.video.srcObject = null;
                    window.stream.getTracks().forEach(track => track.stop());
                }
            },

            //canvas中展示截取的图像
            getImg() {
                this.canvasShotDig = true;
                var canvas = this.$refs.canvas;
                var context = canvas.getContext("2d");
                context.drawImage(this.video, 0, 0, 270, 200);
                var image = canvas.toDataURL("image/png");
                var timestamp = Date.parse(new Date());//获取时间戳，防止图像重名
                var img = this.dataURLtoFile(image, timestamp+".png");//使用png的图像进行名称拼接

                var formData = new FormData();
                formData.append("file",img); //将生成的图像生成file文件对象



                // //上传图片的接口与后端进行交互，获取图片
                // uploadImg(formData ).then(res => {
                //     this.imageUrl = res.data.message.url
                // });
            },

            //图片转base64位
            dataURLtoFile(dataurl, filename) {
                var arr = dataurl.split(","),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                var file = new File([u8arr], filename, { type: mime });
                return new File([u8arr], filename, { type: mime });
            },
        }
    }
</script>

<style scoped>
    .video-box {
        position: relative;
        width: 100%;
    }
    video{
        top: 0;
        left: 0;
        width: 100%;
        border: #000000  2px dashed;
    }
    .handle-box {

    }

</style>