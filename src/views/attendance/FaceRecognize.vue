<template>
    <div class="app-container">
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
                   <el-row class="attendance-box">
                       <el-card class="video-box">
                           <div slot="header" class="clearfix">
                               <span>实时人脸</span>
                           </div>
                           <video id="video" preload autoplay loop muted></video>
                       </el-card>
                   </el-row>
                   <el-row :gutter="15" style="margin-top: 10px">
                       <el-col :span="12">
                           <el-card>
                               <div slot="header">
                                   <span>人脸截取</span>
                               </div>
                               <canvas class="canvas-shot" id="screenshotCanvas"></canvas>

                           </el-card>
                       </el-col>
                       <el-col :span="12">
                           <el-card>
                               <div slot="header">
                                   <span>数据库人脸</span>
                               </div>
                               <canvas class="canvas-show" id="canvas"></canvas>
                           </el-card>
                       </el-col>
                   </el-row>
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

    </div>
</template>

<script>
    import tracking from '@/assets/tracking/build/tracking-min.js';
    import '@/assets/tracking/build/data/face-min.js';
    import qs from 'qs'

    export default {
        data() {
            return {
                filterText: '',

                collegeClassTree: [],

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },

                video: null,
                screenshotCanvas: null,
                uploadLock: true, // 上传锁
                image: '',

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
                value: [],
                studentDig: false,
                studentList: [],

                total: 0,
                size: 10,
                current: 1,

                searchForm: {},
            }
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
        methods: {
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
                this.studentDig = false
            },

            // 初始化设置
            init() {
                this.video = document.getElementById('video');
                this.screenshotCanvas = document.getElementById('screenshotCanvas');

                let canvas = document.getElementById('canvas');
                let context = canvas.getContext('2d');

                // 固定写法
                let tracker = new window.tracking.ObjectTracker('face');
                tracker.setInitialScale(4);
                tracker.setStepSize(2);
                tracker.setEdgesDensity(0.1);
                window.tracking.track('#video', tracker, {
                    camera: true
                });

                this.video.srcObject = window.stream;

                let _this = this;
                tracker.on('track', function(event) {

                    // 检测出人脸 绘画人脸位置
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    event.data.forEach(function(rect) {
                        context.strokeStyle = '#00d1b2';
                        context.strokeRect(rect.x, rect.y, rect.width, rect.height);

                        // 上传图片
                        _this.uploadLock && _this.screenshotAndUpload();
                    });
                });
            },

            stopMediaStreamTrack() {
                console.log(typeof window.stream)

                if (typeof(window.stream) === "object") {
                    //	this.videoEl是视频流容器，也就是video标签，需要在data中声明这个变量，然后在打开摄像头的方法中this.videoEl.srcObject = window.stream
                    this.video.srcObject = null;
                    console.log(window.stream.getTracks())
                    window.stream.getTracks().forEach(track => track.stop());
                }
            },

            // 上传图片
            screenshotAndUpload() {
                // 上锁避免重复发送请求
                this.uploadLock = false;

                // 绘制当前帧图片转换为base64格式
                let canvas = this.screenshotCanvas;
                let video = this.video;
                let ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                let base64Img = canvas.toDataURL('image/jpeg');

                // 使用 base64Img 请求接口即可
                // console.log('base64Img:',base64Img)

                this.uploadFaceImg(base64Img)
                // 请求接口成功以后打开锁
                // this.uploadLock = true;
            },

            // 上传人脸数据，同一个人返回true，否则返回false
            uploadFaceImg(base64Img) {
                let uploadForm = {
                    username: '18251104129',
                    nowimage: base64Img
                }
                console.log(uploadForm.nowimage)
                this.$axios.post('/attendance/recognize', uploadForm ).then(res => {
                    if(res.data.code === 200) {
                        if(res.data.msg == '同一个人') {
                            this.$notify({
                                showClose: true,
                                message: res.data.msg,
                                type: 'success'
                            });
                        } else {
                            this.$notify({
                                showClose: true,
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    }
                    this.sleep(2000)
                    this.uploadLock = true

                })
                // this.screenshotAndUpload()
            },

            sleep(numberMillis){
                var now = new Date();
                var exitTime = now.getTime() + numberMillis;
                while (true) {
                    now = new Date();
                    if (now.getTime() > exitTime) return 1;
                }
            }
        }
    }
</script>

<style scoped>
    /* 绘图canvas 不需显示隐藏即可 */


    .video-box{
        position: relative;
        width: 100%;
    }


    video{
        top: 0;
        left: 0;
        width: 100%;
        border: #000000  2px dashed;
    }


    .canvas-show {
        width: 100%;
        height: 190px;
        border: #a8c023 2px dashed;
    }

    .canvas-shot {
        width: 100%;
        height: 190px;
        border: #a8c023 2px dashed;
    }

    .handle-box {
        margin-bottom: 0px;
    }

</style>