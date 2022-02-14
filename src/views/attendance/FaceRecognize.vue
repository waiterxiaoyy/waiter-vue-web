<template>
    <div class="app-container">
       <el-card>
           <el-row :gutter="20">
               <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6" style="margin-bottom: 15px">
                   <el-tree
                           class="filter-tree"
                           :data="data"
                           :props="defaultProps"
                           default-expand-all
                           @node-click="handleNodeClick"
                           ref="tree">
                   </el-tree>
               </el-col>
               <el-col :xs="24" :sm="24" :md="24"  :lg="8" :xl="8" style="margin-bottom: 15px">
                   <el-form ref="form" :model="form" label-width="80px">
                       <el-form-item label="学生姓名">
                           <el-input v-model="form.name"></el-input>
                       </el-form-item>
                       <el-form-item label="学生学号">
                           <el-input v-model="form.name"></el-input>
                       </el-form-item>
                       <el-form-item label="所在班级">
                           <el-cascader
                                   v-model="value"
                                   :options="options"></el-cascader>
                       </el-form-item>
                       <el-form-item label="考勤时间">
                           <el-col :span="11">
                               <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                           </el-col>
                           <el-col class="line" :span="2">-</el-col>
                           <el-col :span="11">
                               <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                           </el-col>
                       </el-form-item>
                       <el-form-item>
                           <el-button type="primary">立即创建</el-button>
                           <el-button>取消</el-button>
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
                               <canvas class="canvas-show" id="canvas"></canvas>
                           </el-card>
                       </el-col>
                       <el-col :span="12">
                           <el-card>
                               <div slot="header">
                                   <span>数据库人脸</span>
                               </div>
                               <canvas class="canvas-shot" id="screenshotCanvas"></canvas>
                           </el-card>
                       </el-col>
                   </el-row>
               </el-col >
           </el-row>
       </el-card>

    </div>
</template>

<script>
    import tracking from '@/assets/tracking/build/tracking-min.js';
    import '@/assets/tracking/build/data/face-min.js';
    import qs from 'qs'

    export default {
        data() {
            return {
                video: null,
                screenshotCanvas: null,
                uploadLock: true, // 上传锁
                image: '',
                data: [
                    {
                        id: 1,
                        label: '信息学院',
                        children: [{
                            id: 4,
                            label: '软件工程',
                            children: [{
                                id: 9,
                                label: '2018软件工程1班'
                            }, {
                                id: 10,
                                label: '2018软件工程2班'
                            }]
                        }]
                    }, {
                        id: 2,
                        label: '金融学院',
                        children: [{
                            id: 5,
                            label: '二级 2-1'
                        }, {
                            id: 6,
                            label: '二级 2-2'
                        }]
                    }, {
                        id: 3,
                        label: '一级 3',
                        children: [{
                            id: 7,
                            label: '二级 3-1'
                        }, {
                            id: 8,
                            label: '二级 3-2'
                        }]
                    }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                value: [],
                options: [{
                    value: 'zhinan',
                    label: '指南',
                    children: [{
                        value: 'shejiyuanze',
                        label: '设计原则',
                        children: [{
                            value: 'yizhi',
                            label: '一致'
                        }, {
                            value: 'fankui',
                            label: '反馈'
                        }, {
                            value: 'xiaolv',
                            label: '效率'
                        }, {
                            value: 'kekong',
                            label: '可控'
                        }]
                    }, {
                        value: 'daohang',
                        label: '导航',
                        children: [{
                            value: 'cexiangdaohang',
                            label: '侧向导航'
                        }, {
                            value: 'dingbudaohang',
                            label: '顶部导航'
                        }]
                    }]
                }, {
                    value: 'zujian',
                    label: '组件',
                    children: [{
                        value: 'basic',
                        label: 'Basic',
                        children: [{
                            value: 'layout',
                            label: 'Layout 布局'
                        }, {
                            value: 'color',
                            label: 'Color 色彩'
                        }, {
                            value: 'typography',
                            label: 'Typography 字体'
                        }, {
                            value: 'icon',
                            label: 'Icon 图标'
                        }, {
                            value: 'button',
                            label: 'Button 按钮'
                        }]
                    }, {
                        value: 'form',
                        label: 'Form',
                        children: [{
                            value: 'radio',
                            label: 'Radio 单选框'
                        }, {
                            value: 'checkbox',
                            label: 'Checkbox 多选框'
                        }, {
                            value: 'input',
                            label: 'Input 输入框'
                        }, {
                            value: 'input-number',
                            label: 'InputNumber 计数器'
                        }, {
                            value: 'select',
                            label: 'Select 选择器'
                        }, {
                            value: 'cascader',
                            label: 'Cascader 级联选择器'
                        }, {
                            value: 'switch',
                            label: 'Switch 开关'
                        }, {
                            value: 'slider',
                            label: 'Slider 滑块'
                        }, {
                            value: 'time-picker',
                            label: 'TimePicker 时间选择器'
                        }, {
                            value: 'date-picker',
                            label: 'DatePicker 日期选择器'
                        }, {
                            value: 'datetime-picker',
                            label: 'DateTimePicker 日期时间选择器'
                        }, {
                            value: 'upload',
                            label: 'Upload 上传'
                        }, {
                            value: 'rate',
                            label: 'Rate 评分'
                        }, {
                            value: 'form',
                            label: 'Form 表单'
                        }]
                    }, {
                        value: 'data',
                        label: 'Data',
                        children: [{
                            value: 'table',
                            label: 'Table 表格'
                        }, {
                            value: 'tag',
                            label: 'Tag 标签'
                        }, {
                            value: 'progress',
                            label: 'Progress 进度条'
                        }, {
                            value: 'tree',
                            label: 'Tree 树形控件'
                        }, {
                            value: 'pagination',
                            label: 'Pagination 分页'
                        }, {
                            value: 'badge',
                            label: 'Badge 标记'
                        }]
                    }, {
                        value: 'notice',
                        label: 'Notice',
                        children: [{
                            value: 'alert',
                            label: 'Alert 警告'
                        }, {
                            value: 'loading',
                            label: 'Loading 加载'
                        }, {
                            value: 'message',
                            label: 'Message 消息提示'
                        }, {
                            value: 'message-box',
                            label: 'MessageBox 弹框'
                        }, {
                            value: 'notification',
                            label: 'Notification 通知'
                        }]
                    }, {
                        value: 'navigation',
                        label: 'Navigation',
                        children: [{
                            value: 'menu',
                            label: 'NavMenu 导航菜单'
                        }, {
                            value: 'tabs',
                            label: 'Tabs 标签页'
                        }, {
                            value: 'breadcrumb',
                            label: 'Breadcrumb 面包屑'
                        }, {
                            value: 'dropdown',
                            label: 'Dropdown 下拉菜单'
                        }, {
                            value: 'steps',
                            label: 'Steps 步骤条'
                        }]
                    }, {
                        value: 'others',
                        label: 'Others',
                        children: [{
                            value: 'dialog',
                            label: 'Dialog 对话框'
                        }, {
                            value: 'tooltip',
                            label: 'Tooltip 文字提示'
                        }, {
                            value: 'popover',
                            label: 'Popover 弹出框'
                        }, {
                            value: 'card',
                            label: 'Card 卡片'
                        }, {
                            value: 'carousel',
                            label: 'Carousel 走马灯'
                        }, {
                            value: 'collapse',
                            label: 'Collapse 折叠面板'
                        }]
                    }]
                }]
            }
        },
        mounted() {
            // this.init()
        },
        methods: {
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
                    username: '18251104126',
                    nowimage: base64Img
                }
                console.log(uploadForm.nowimage)
                this.$axios.post('/attendance/recognize', uploadForm ).then(res => {
                    if(res.data.code === 200) {
                        this.$notify({
                            showClose: true,
                            message: res.data.msg,
                            type: 'success'
                        });
                    }
                    this.sleep(1000)
                    this.uploadLock = true


                })
                // this.screenshotAndUpload()
            },
            handleNodeClick(data) {
                console.log(data);
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

</style>