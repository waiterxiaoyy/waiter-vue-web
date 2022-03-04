<template>
    <div class="container">
        <el-page-header @back="goBack" content="班级详情">
        </el-page-header>

        <el-row :gutter="20">
            <el-col span="14">
                <div class="course-abt">
                    <div class="course-title">
                        软件工程教学班1
                    </div>


                    <div class="course-info">
                        <span><i class="el-icon-s-custom"></i> 王小二</span><el-divider direction="vertical"></el-divider>
                        <span><i class="el-icon-orange"></i> 59人</span>
                    </div>
                    <el-divider></el-divider>
                </div>
                <div class="course-manage">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="课程详情" name="first">
                            <div class="course-desc">
                                <div class="course-desc-title">
                                    课程简介
                                </div>
                                <div class="course-desc-info">
                                    本课程介绍编程语言的基本概念，重点介绍函数式编程。本课程使用的语言ML，球拍，红宝石作为教学概念的车辆，但真正的意图是教足够的关于如何任何语言“合在一起”，使您更有效的编程在任何语言-和学习新的...
                                </div>
                            </div>

                            <div class="course-desc">
                                <div class="course-desc-title">
                                    课程教学
                                </div>
                                <div class="course-desc-info">
                                    <div class="course-desc-info-avatar">
                                        <el-avatar :size="80" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
                                    </div>
                                    <div class="course-desc-info-abt">
                                        <div class="course-desc-info-abt-desc">
                                            <div class="course-desc-info-abt-desc-tittle">任课教师: </div>
                                            <div class="course-desc-info-abt-desc-info">王小二</div>
                                        </div>
                                        <div class="course-desc-info-abt-desc">
                                            <div class="course-desc-info-abt-desc-tittle">教师描述: </div>
                                            <div class="course-desc-info-abt-desc-info">JavaEE开发与教学多年，精通JavaEE技术体系，对流行框架JQuery、DWR、Struts1/2，Hibernate，Spring，MyBatis、JBPM、Lucene等有深入研究。授课逻辑严谨，条理清晰，注重学生独立解决问题的能力。</div>
                                        </div>
                                        <div class="course-desc-info-abt-desc">
                                            <div class="course-desc-info-abt-desc-tittle">导师类别: </div>
                                            <div class="course-desc-info-abt-desc-info">博士生导师、硕士生导师</div>
                                        </div>
                                        <div class="course-desc-info-abt-desc">
                                            <div class="course-desc-info-abt-desc-tittle">联系方式: </div>
                                            <div class="course-desc-info-abt-desc-info">waiterxiaoyy@qq.com</div>
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
                                                v-model="searchForm.username"
                                                placeholder="用户名"
                                                clearable
                                        >
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item>
                                        <el-button @click="getUserList" icon="el-icon-search">搜索</el-button>
                                    </el-form-item>

                                    <el-form-item>
                                        <el-button type="primary" @click="dialogVisible = true" v-if="hasAuth('sys:user:save')" icon="el-icon-circle-plus-outline">新增</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-popconfirm title="这是确定批量删除吗？" @onConfirm="delHandle(null)">
                                            <el-button type="danger" slot="reference" :disabled="delBtlStatu" v-if="hasAuth('sys:user:delete')">批量删除</el-button>
                                        </el-popconfirm>
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
                                                <el-form-item label="发布人">
                                                    <span>{{ props.row.teacherName }}</span>
                                                </el-form-item>
                                                <el-form-item label="发布时间">
                                                    <span>{{ props.row.beginTime }}</span>
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
                                            prop="homeworkTitle"
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
                                            <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
                                            <el-divider direction="vertical"></el-divider>
                                            <el-button type="text" @click="editHandle(scope.row.id)">详情</el-button>
                                            <el-divider direction="vertical"></el-divider>
                                            <el-button type="text" @click="editHandle(scope.row.id)">完成情况</el-button>
                                            <el-divider direction="vertical"></el-divider>

                                            <template>
                                                <el-popconfirm title="此操作为危险操作，确认删除吗？" confirm-button-text="确认" cancel-button-text="取消" @onConfirm="delHandle(scope.row.id)">
                                                    <el-button type="text" slot="reference">删除</el-button>
                                                </el-popconfirm>
                                            </template>

                                        </template>


                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="考勤情况" name="third">考勤情况</el-tab-pane>
                        <el-tab-pane label="班级成员" name="fourth">班级成员</el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
            <el-col span="10">
                <div class="comment-bd"  style="overflow:auto">
                    <div class="comment-header">
                        <span>讨论区</span>
                        <el-divider></el-divider>
                    </div>
                    <div class="comment-main" >
                        <template v-for="i in count">
                            <div class="comment-item">
                                <div class="comment-user">
                                    <div class="comment-user-avatar">
                                        <el-avatar :size="30" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
                                    </div>
                                    <div class="comment-user-name">
                                        王小二
                                    </div>
                                    <div class="comment-user-time">
                                        2021-10-28 15:00:00
                                    </div>
                                </div>
                                <div class="comment-content">
                                    有趣的课程，可以对函数式编程产生初步的认识可以对函数式编程产生初步的认识可以对函数式编程产生初步的认识可以对函数式编程产生初步的认识可以对函数式编程产生初步的认识，值的一学。获得的毕业证书企业也……
                                </div>
                                <div class="comment-handle">
                                    <el-button style="margin-right: 3px" type="text">回复 </el-button>
                                    <el-divider direction="vertical"></el-divider>
                                    <el-button style="margin-left: 3px;margin-right: 3px" type="text"> 删除</el-button>
                                    <el-divider direction="vertical"></el-divider>
                                    <el-button style="margin-left: 3px" type="text"> 禁出</el-button>
                                </div>
                            </div>
                            <div class="comment-subItem">
                                <el-divider><span style="color: #20b2aa">以下是老师回复</span></el-divider>
                                <div class="comment-item">
                                    <div class="comment-user">
                                        <div class="comment-user-avatar">
                                            <el-avatar :size="30" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
                                        </div>
                                        <div class="comment-user-name">
                                            王小二
                                        </div>
                                        <div class="comment-user-time">
                                            2021-10-28 15:00:00
                                        </div>
                                    </div>
                                    <div class="comment-content">
                                        程产生初步的认识可以对函数式编程产生书企业也……
                                    </div>
                                </div>

                            </div>
                            <el-divider></el-divider>
                        </template>
                        <el-pagination
                                background
                                :page-sizes="[100, 200, 300, 400]"
                                :page-size="100"
                                layout="sizes, prev, pager, next"
                                :total="1000"
                                :pager-count="5">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        name: "CourseDetail",
        data() {
            return {
                activeName: 'second',
                homeworkTable: [
                    {
                        homeworkTitle: '第一周第一次作业',
                        statu: 1,
                        teacherName: '王小二',
                        beginTime: '2021-10-21',
                        endTime: '2021-10-21',
                    },
                    {
                        homeworkTitle: '第一周第一次作业',
                        statu: 0,
                        teacherName: '王小二',
                        beginTime: '2021-10-21',
                        endTime: '2021-10-21',
                    }
                ],
                delBtlStatu: true,
                searchForm: {},
                dialogVisible: false,
                count: 2

            }
        },
        methods: {
            goBack() {
                console.log('go back');
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            filterHandler (value, row) {
                return row.row === value
            },
            load () {
                this.count = 8
            }

        }
    }

</script>

<style>
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

    .course-desc-info-avatar {
        text-align: center;
        top: 50%;
        margin-top: 30px;
    }

    .course-desc-info-abt {
        flex: 1;
        margin-left: 10px;

    }

    .course-desc-info-abt-desc {
        width: 100%;
        display: flex;
        margin: 10px 0 10px 0;
    }

    .course-desc-info-abt-desc-tittle {
        font-size: 14px;
        width: 80px;
        font-weight: bold;
    }
    .course-desc-info-abt-desc-info {
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
        width: 50px;
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
        margin: 8px 5px 5px 8px;
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




</style>