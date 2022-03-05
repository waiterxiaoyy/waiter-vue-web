<template>
    <div class="container">
        <el-row :gutter="5">
            <el-col :span="14">
                <!--操作栏 begin-->
                <div class="handle-box">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-input
                                    v-model="searchForm.value"
                                    placeholder="输入名称"
                                    clearable
                            >
                            </el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button @click="" icon="el-icon-search">搜索</el-button>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="editTermDig = true" v-if="hasAuth('sys:user:save')" icon="el-icon-circle-plus-outline">新学期</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="editCourseHandle(1)" v-if="hasAuth('sys:user:save')" icon="el-icon-circle-plus-outline">新课程</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <!--操作栏 end-->

                <el-table
                        :data="tableData"
                        style="width: 100%;margin-bottom: 20px;"
                        row-key="id"
                        :default-expand-all="false"
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

                    <el-table-column
                            prop="name"
                            label="名称"
                            sortable
                            width="250">
                    </el-table-column>

                    <el-table-column
                            prop="type"
                            label="类型">
                        <template slot-scope="scope"  >
                            <el-tag size="small" effect="dark" v-if="scope.row.type === 0">学院</el-tag>
                            <el-tag size="small" effect="dark" v-else-if="scope.row.type === 1" type="success">专业</el-tag>
                            <el-tag size="small" effect="dark" v-else-if="scope.row.type === 2" type="warning">班级</el-tag>
                        </template>

                    </el-table-column>

                    <el-table-column
                            prop="statu"
                            label="状态">
                        <template slot-scope="scope">
                            <el-tag size="small" v-if="scope.row.statu === 1" type="success">正常</el-tag>
                            <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">关闭</el-tag>
                        </template>

                    </el-table-column>
                    <el-table-column
                            prop="icon"
                            label="操作" v-if="hasAuth('sys:dept:update')">

                        <template slot-scope="scope" >
                            <el-button type="text" @click="editHandle(scope.row)">编辑</el-button>
                            <el-divider direction="vertical"></el-divider>

                            <template>
                                <el-popconfirm title="此操作为危险操作，是否确认删除" confirm-button-text="确认" cancel-button-text="取消" @onConfirm="delHandle(scope.row.id)">
                                    <el-button type="text" slot="reference">删除</el-button>
                                </el-popconfirm>
                            </template>

                        </template>
                    </el-table-column>

                </el-table>

            </el-col>
            <el-col :span="10">
                <div class="courses-page" v-if="list.length > 0">
                    <div class="c-list">
                        <div class="c-item" v-for="(item,index) in list" :key="index" @click="$router.push({name: 'CoursesInfo', query: {id: item.id}})">
                            <img class="cover" :src="item.h_cover" alt="">
                            <div class="item-r">
                                <div>
                                    <div class="title">{{item.title}}</div>
                                    <div class="desc">{{item.abstract}}</div>
                                </div>
                                <div class="info">
                                    <span><i class="el-icon-s-custom"></i>{{item.page_count}}人</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>暂无课程

                    <el-empty  description="暂无课程"></el-empty>
                </div>

            </el-col>
        </el-row>

        <!--新增学期-->
        <el-dialog
                title="新增学期"
                :visible.sync="editTermDig"
                width="30%">
            <el-form ref="editTermForm" :model="editTermForm" label-width="80px" :rules="editFormRules">
                <el-form-item  label="名称" prop="term">
                    <el-input v-model="editTermForm.term" placeholder="正确格式:[2021-2022-1]"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="statu">
                    <el-radio-group v-model="editTermForm.statu">
                        <el-radio :label=0>禁用</el-radio>
                        <el-radio :label=1>正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序号" prop="orderNum">
                    <el-input-number v-model="editTermForm.orderNum" :min="1" label="排序号">1</el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editTermDig = false">取 消</el-button>
            <el-button type="primary" @click="addTermHandler('editTermForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!--创建课程-->
        <el-dialog
                title="创建课程"
                :visible.sync="editCourseDig"
                width="50   %">
            <el-form ref="editTermForm" label-position="right" :model="editCourseForm" label-width="80px" :rules="editFormRules">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item label="选择学期" prop="termId">
                            <el-select v-model="editCourseForm.termId" placeholder="请选择学期">
                                <template v-for="item in termList">
                                    <el-option :label="item.term" :value="item.id"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="选择学院" prop="collegeId">
                            <el-select v-model="editCourseForm.collegeId" placeholder="请选择学院">
                                <template v-for="item in collegeList">
                                    <el-option :label="item.name" :value="item.id"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课程类型" prop="type">
                            <el-select v-model="editCourseForm.type" placeholder="请选择学院">
                                <template v-for="item in courseType">
                                    <el-option :label="item.name" :value="item.id"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课程状态" prop="statu">
                            <el-radio-group v-model="editCourseForm.statu">
                                <el-radio :label=0>禁用</el-radio>
                                <el-radio :label=1>正常</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="排序号" prop="orderNum">
                            <el-input-number v-model="editCourseForm.orderNum" :min="1" label="排序号">1</el-input-number>
                        </el-form-item>
                    </el-col>

                    <el-col :span="14">
                        <el-form-item  label="课程名称" prop="courseName">
                            <el-input v-model="editCourseForm.courseName" placeholder="课程名"></el-input>
                        </el-form-item>

                        <el-form-item  label="课程描述"  prop="description">
                            <el-input type="textarea" v-model="editCourseForm.description" placeholder="给课程来一段优美的描述吧"></el-input>
                        </el-form-item>

                        <el-form-item  label="课程图片">
                            <el-input v-model="editCourseForm.image" placeholder="（自由输入地址或者上传图片，否则使用默认图片）"></el-input>
                            <el-upload
                                    class="upload-demo"
                                    action="#"
                                    :auto-upload="false"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :on-exceed="handleExceed"
                                    :before-remove="beforeRemove"
                                    :file-list="courseImageList"
                                    :limit="1"
                                    accept=".jpg,.jpeg,.png"
                                    list-type="picture">
                                <el-button size="small" type="success" ><i class="el-icon-upload"></i>点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>





            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editTermDig = false">取 消</el-button>
            <el-button type="primary" @click="addTermHandler('editTermForm')">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    const courseType = [
        {
            name: "专业必修",
            id: 1
        },
        {
            name: "专业选修",
            id: 2
        },
        {
            name: "通识必修",
            id: 3
        },
        {
            name: "通识选修",
            id: 4
        },
        {
            name: "体育课",
            id: 5
        },
    ]
    export default {
        name: "CourseManage",
        data () {
            return {
                init: true,
                list: [],
                searchForm: {},

                editTermDig: false,
                editTermForm: {},
                editFormRules: {
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ],
                    term: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    termId: [
                        {required: true, message: '请选择学期', trigger: 'blur'}
                    ],
                    collegeId: [
                        {required: true, message: '请选择学院', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择课程类型', trigger: 'blur'}
                    ],
                    courseName: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {min: 2, max: 20, message: '长度在2-20之间', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '课程描述不可为空', trigger: 'blur'},
                        {min: 5, max: 500, message: '长度在5-500之间', trigger: 'blur'}
                    ],
                    orderNum: [
                        {required: true, message: '请填入排序号', trigger: 'blur'}
                    ],
                },

                editCourseForm: {},
                editCourseDig: false,
                termList: {},
                collegeList: {},
                courseType: courseType,
                courseImageList: {}

            }
        },
        created() {
          var info =  {
              h_cover: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              title: '软件工程教学班1',
              abstract: '本课程介绍编程语言的基本概念，重点介绍函数式编程...',
              page_count: 1,
              view_count: 100
          }
          for(var i = 0; i < 10; i++) {
              this.list.push(info)
            }
        },
        mounted () {
            // this.$vux.loading.show()
            // this.$http.get('v1/member-souse').then(
            //     res => {
            //         this.$vux.loading.hide()
            //         if (res.code === 200) {
            //             this.init = true
            //             this.list = res.data.list
            //         }
            //     },
            //     fail => {
            //         this.$vux.loading.hide()
            //     }
            // )
        },
        methods: {
            editCourseHandle(num) {
              if(num == 1) {
                  this.getTermList();
                  this.getDeptList();
                  this.editCourseDig = true
              }
            },
            getTermList() {
                this.$axios.get('/course/getTermList').then(res=>{
                    this.termList = res.data.data
                })
            },
            getDeptList() {
                this.$axios.get("/sys/dept/getlist").then(res => {
                    this.collegeList = res.data.data
                })
            },
            addTermHandler(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        var temp = this.editTermForm.term.split("-");
                        console.log(temp)
                        if(temp.length == 3) {
                            if(!(temp[0] > 999 && temp[0] < 9999 && temp[1] > 999 && temp[1] < 9999 && (temp[2] == 1 || temp[2] == 2) )) {
                                this.$notify({
                                    showClose: true,
                                    title: '学期格式不正确',
                                    message: '正确格式:[2021-2022-1]',
                                    type: 'warning'
                                });
                                return false
                            }
                        } else {
                            this.$notify({
                                showClose: true,
                                title: '学期格式不正确',
                                message: '正确格式:[2021-2022-1]',
                                type: 'warning'
                            });
                            return false
                        }
                        this.$axios.post('/course/addTerm', this.editTermForm).then(res => {
                            this.$notify({
                                showClose: true,
                                message: '创建新学期成功',
                                type: 'success'
                            });
                            this.editTermDig = false;
                        })
                    } else{
                        return false;
                    }
                })
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
                this.$message.warning(`只能选择一张图片`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            }
        }
    }
</script>
<style>
    .handle-box {
    }
    .courses-page {
        position: relative;
        width: 100%;
    }
    .c-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        width: 100%;
        transition: all 0.3s;
    }
    .c-item {
        position: relative;
        float: left;
        width: 228px;
        height: 270px;
        background-color: #ffffff;
        margin: 0 15px 15px 0;
        overflow: hidden;
        box-shadow: 3px 3px 10px #99a9bf;
        cursor: pointer;
        border-radius: 3px;
        transition: all 0.3s;
    }
    .c-item:hover{
        box-shadow: 2px 3px 10px rgb(36, 35, 35);
    }

    .cover {
        width: 228px;
        height: 149px;
    }
    .item-r {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .title {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 220px;
        height: 38px;
        font-weight: bold;
        padding: 5px;
    }
    .desc {
        width: 220px;
        height: 35px;
        padding: 5px;
        font-size: 0.6rem;
        overflow: hidden;
    }
    .info {
        width: 205px;
        padding: 3px 10px 0 10px;
        font-size: 0.7rem;
        background-color: #ffffff;
    }

    .upload-demo {
        margin-top: 10px;
    }

</style>