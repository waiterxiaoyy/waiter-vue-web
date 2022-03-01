<template>
    <el-drawer
            title="人脸录入"
            :append-to-body="true"
            :before-close="handleClose"
            direction="rtl"
            size="80%"
            :visible.sync="faceDrawer">
        <div>
            <el-row :gutter="20" class="face-box">

                <el-col span="10">
                    <div class="video-box">
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
                        <video  ref="video"></video>
                    </div>
                </el-col>

                <el-col span="8">
                    <div class="shot-top">
                        <div class="shot-tip">
                            此处人脸截图将作为学生人脸数据
                        </div>
                    </div>
                    <canvas width="370" height="280" style="border: #000000  2px dashed" ref="canvas"></canvas>
                </el-col>
                <el-col span="6">
                    <div class="shot-tip">
                        请确认学生信息
                    </div>
                    <el-form ref="studentForm" :model="studentForm" label-width="80px" style="margin-right: 10px" :rules="formRules">
                        <el-form-item label="学生姓名" prop="studentName">
                            <el-input v-model="studentForm.studentName"></el-input>
                        </el-form-item>
                        <el-form-item label="学生学号" prop="studentId">
                            <el-input v-model="studentForm.studentId"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="init">上传人脸数据</el-button>
                            <el-button @click="stopMediaStreamTrack">取 消</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </el-drawer>
</template>

<script>
    export default {
        name: "FaceUploadDrawer",
        props: {
            faceDrawer: {
                type: Boolean
            },
            studentForm: {
                type: Array
            }
        },
        data() {
            return {
                video: null,
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

                openSta: false,

            }
        },
        methods: {
            handleClose() {
                if(this.openSta) {
                    this.$notify({
                        title: '提示',
                        message: '请先关闭摄像头',
                        type: 'error'
                    })
                    return
                }
                this.$emit('update:faceDrawer', false)
            },

            openCamera(){
                this.openSta = true;
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
                    this.openSta = false;
                }
            },

            //canvas中展示截取的图像
            getImg() {
                this.canvasShotDig = true;
                var canvas = this.$refs.canvas;
                var context = canvas.getContext("2d");
                context.drawImage(this.video, 0, 0, 380, 280);
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
        width: 500px;
        margin: 0 0 0 10px;
    }
    video{
        top: 0;
        left: 0;
        width: 100%;
        border: #000000  2px dashed;
    }
    canvas {
        margin: 0px 0 0 10px;
    }
    .shot-top {

    }

    .shot-tip {
        text-align: left;
        color: #ffffff;
        padding: 8px 16px;
        background-color: #5977b5;
        border-radius: 4px;
        border-left: 8px solid #01355d;
        margin: 5px 10px 10px 10px;
    }
</style>