<template>
    <el-dialog title="考勤"
               :visible.sync="attendanceInfoDig"
               width="1000px"
               :before-close="handleBeforeClose">
        <el-row>
            <el-col :span="14">
                <el-row>
                    <!--操作栏 begin-->
                    <div class="handle-box">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-button type="success" icon="el-icon-camera-solid" class="mr10" v-if="hasAuth('attendance:course:teac')" @click="getCompetence">打开摄像头</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="info" icon="el-icon-close" class="mr10"v-if="hasAuth('attendance:course:teac')" @click="stopNavigator">关闭摄像头</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-picture-outline" class="mr10"v-if="hasAuth('attendance:course:teac')" @click="setImage">截图考勤</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-row>
                <el-row>
                    <div class="camera_outer">
                        <video id="videoCamera" :width="videoWidth" :height="videoHeight" autoplay></video>
                        <canvas style="display:none;" id="canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
                        <div v-if="imgSrc" class="img_bg_camera">
                            <p>截图考勤</p>
                            <img :src="imgSrc" alt class="tx_img" />
                        </div>
                    </div>
                </el-row>
            </el-col>
            <el-col :span="10">
                <el-table
                        ref="singleTable"
                        :data="studentList"
                        height="450"
                        @row-click="handleStudentSelect"
                        highlight-current-row
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
                            <el-tag v-if="scope.row.statu == 0" type="info" effect="dark" size="small">未考勤</el-tag>
                            <el-tag v-if="scope.row.statu == 1" type="success" effect="dark" size="small">已考勤</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

    </el-dialog>

</template>

<script>

    export default {
        name: "AttendanceInfo",
        props: {
            attendanceInfoDig: {
                type: Boolean
            },
            attendanceId: {
                type: Number
            }
        },

        created() {
        },
        data() {
            return {
                studentList: [],

                videoWidth: 500,
                videoHeight: 250,
                imgSrc: "",
                thisCancas: null,
                thisContext: null,
                thisVideo: null,
                openVideo: false,
                attendanceForm: {
                    image: '',
                    studentId: '',
                    attendanceId: 0
                },
                currentRow: null,
                faceLock: false

            }
        },
        watch: {
            attendanceInfoDig: {
                handler(newValue) {
                    this.attendanceInfoDig = newValue;
                    if(this.attendanceInfoDig == true) {
                        this.attendanceForm.attendanceId = this.attendanceId;
                        this.getAttendanceInfo(this.attendanceId);
                    }
                }
            },
            attendanceId: {
                handler(newValue) {
                    this.attendanceId = newValue
                }
            }
        },
        methods: {
            handleBeforeClose() {
                if(this.openVideo) {
                    this.$notify({
                        showClose: true,
                        message: '摄像头未关闭',
                        type: 'warning'
                    });
                    return
                }
                this.$emit('update:attendanceInfoDig', false)
            },
            getAttendanceInfo(id) {
                this.$axios.get('/attendance/course/getAttendanceInfo/' + id).then(res=>{
                    this.studentList = res.data.data;
                })
            },
            // 调用权限（打开摄像头功能）
            getCompetence() {
                this.openVideo = true;
                var _this = this;
                _this.thisCancas = document.getElementById("canvasCamera");
                _this.thisContext = this.thisCancas.getContext("2d");
                _this.thisVideo = document.getElementById("videoCamera");
                _this.thisVideo.style.display = 'block';
                // 获取媒体属性，旧版本浏览器可能不支持mediaDevices，我们首先设置一个空对象
                if (navigator.mediaDevices === undefined) {
                    navigator.mediaDevices = {};
                }
                // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
                // 使用getUserMedia，因为它会覆盖现有的属性。
                // 这里，如果缺少getUserMedia属性，就添加它。
                if (navigator.mediaDevices.getUserMedia === undefined) {
                    navigator.mediaDevices.getUserMedia = function(constraints) {
                        // 首先获取现存的getUserMedia(如果存在)
                        var getUserMedia =
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.getUserMedia;
                        // 有些浏览器不支持，会返回错误信息
                        // 保持接口一致
                        if (!getUserMedia) {//不存在则报错
                            return Promise.reject(
                                new Error("getUserMedia is not implemented in this browser")
                            );
                        }
                        // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
                        return new Promise(function(resolve, reject) {
                            getUserMedia.call(navigator, constraints, resolve, reject);
                        });
                    };
                }
                var constraints = {
                    audio: false,
                    video: {
                        width: this.videoWidth,
                        height: this.videoHeight,
                        transform: "scaleX(-1)"
                    }
                };
                navigator.mediaDevices
                    .getUserMedia(constraints)
                    .then(function(stream) {
                        // 旧的浏览器可能没有srcObject
                        if ("srcObject" in _this.thisVideo) {
                            _this.thisVideo.srcObject = stream;
                        } else {
                            // 避免在新的浏览器中使用它，因为它正在被弃用。
                            _this.thisVideo.src = window.URL.createObjectURL(stream);
                        }
                        _this.thisVideo.onloadedmetadata = function(e) {
                            _this.thisVideo.play();
                        };
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //  绘制图片（拍照功能）
            setImage() {
                if(!this.openVideo) {
                    this.$notify({
                        showClose: true,
                        message: '请打开摄像头',
                        type: 'warning'
                    });
                    return;
                }
                if(this.attendanceForm.studentId == '') {
                    this.$notify({
                        showClose: true,
                        message: '请选择学生考勤',
                        type: 'warning'
                    });
                    return;
                }
                var _this = this;
                // canvas画图
                _this.thisContext.drawImage(
                    _this.thisVideo,
                    0,
                    0,
                    _this.videoWidth,
                    _this.videoHeight
                );

                // 获取图片base64链接
                var image = this.thisCancas.toDataURL("image/png");
                console.log(image)
                _this.imgSrc = image;//赋值并预览图片
                this.attendanceForm.image = image;
                this.postAttendance()
            },
            // 关闭摄像头
            stopNavigator() {
                this.openVideo = false;
                this.thisVideo.srcObject.getTracks()[0].stop();
            },
            // base64转文件，此处没用到
            dataURLtoFile(dataurl, filename) {
                var arr = dataurl.split(",");
                var mime = arr[0].match(/:(.*?);/)[1];
                var bstr = atob(arr[1]);
                var n = bstr.length;
                var u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, { type: mime });
            },
            handleStudentSelect(row, column, event) {
                this.currentRow = row;
                this.imgSrc = '';
                this.attendanceForm.studentId = row.studentId
            },
            setCurrent(row) {
                this.$refs.singleTable.setCurrentRow(row);
            },
            async postAttendance() {
                if(this.faceLock == true) {
                    this.$message({
                        message: '请勿重复请求',
                        type: 'warning'
                    });
                    return;
                }
                this.faceLock = true;
                const {data: res } = await this.$axios.post("attendance/course/postAttendance", this.attendanceForm);
                if(res.code == 200) {
                    this.$notify({
                        showClose: true,
                        message: '人脸匹配，考勤成功',
                        type: 'success'
                    });
                    this.getAttendanceInfo(this.attendanceId)
                }
                this.faceLock = false;
            }


        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
</style>