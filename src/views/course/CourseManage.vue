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
                            <el-button type="primary" @click="editHandle(3, null)" v-if="hasAuth('sys:user:save')" icon="el-icon-circle-plus-outline">新学期</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="editHandle(4, null)" v-if="hasAuth('sys:user:save')" icon="el-icon-circle-plus-outline">新课程</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <!--操作栏 end-->

                <el-table
                        :data="treeData"
                        style="width: 100%;margin-bottom: 20px;"
                        row-key="id"
                        @row-click="rowClickHandler"
                        :default-expand-all="false"
                        :expand-row-keys="expandRow"
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

                    <el-table-column
                            prop="name"
                            label="名称"
                            width="200">
                    </el-table-column>


                    <el-table-column
                            prop="type"
                            label="类型">
                        <template slot-scope="scope" >
                            <el-tag size="small" effect="dark" v-if="scope.row.type === 0">学期</el-tag>
                            <el-tag size="small" effect="dark" v-else-if="scope.row.type === 1" type="success">课程</el-tag>
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
                            <el-button type="text" v-if="scope.row.type == 0"  @click="editHandle(0, scope.row)">编辑</el-button>
                            <el-button type="text" v-if="scope.row.type == 1" style="color: #48d1cc" @click="editHandle(1, scope.row)">编辑</el-button>
                            <el-button type="text" v-if="scope.row.type == 2" style="color: #ffd04b" @click="editHandle(2, scope.row)">编辑</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" v-if="scope.row.type == 0" @click="editHandle(5, scope.row)">创建课程</el-button>
                            <el-divider v-if="scope.row.type == 0" direction="vertical"></el-divider>
                            <el-button type="text" style="color: #48d1cc" v-if="scope.row.type == 1" @click="editHandle(6, scope.row)">创建班级</el-button>
                            <el-divider v-if="scope.row.type == 1" direction="vertical"></el-divider>
                            <el-button type="text" style="color: #ffd04b" v-if="scope.row.type == 2" @click="editHandle(11, scope.row)">选择学生</el-button>
                            <el-divider v-if="scope.row.type == 2" direction="vertical"></el-divider>

                            <template>
                                <el-popconfirm title="此操作为危险操作，是否确认删除" confirm-button-text="确认" cancel-button-text="取消" @confirm="delHandle(scope.row.id)">
                                    <el-button type="text" v-if="scope.row.type == 0" slot="reference" >删除</el-button>
                                    <el-button type="text" v-if="scope.row.type == 1" style="color: #48d1cc" slot="reference">删除</el-button>
                                    <el-button type="text" v-if="scope.row.type == 2" style="color: #ffd04b" slot="reference">删除</el-button>
                                </el-popconfirm>

                            </template>

                        </template>
                    </el-table-column>

                </el-table>

            </el-col>
            <el-col :span="10">
                <el-empty v-if="!selectCourse"  description="请选择课程"></el-empty>
                <el-card v-if="selectCourse" shadow="hover" class="course-detail-info">
                    <!--操作栏 begin-->
                    <div class="handle-box">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-input
                                        v-model="searchForm.query"
                                        placeholder="搜索班级"
                                        clearable
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button @click="getCourseClassList(editCourseForm.id)" size="mini" icon="el-icon-search">检索</el-button>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" size="mini" @click="editHandle(7, null)" v-if="hasAuth('sys:user:save')" >创建班级</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="text" size="mini" @click="editHandle(4, null)" v-if="hasAuth('sys:user:save')" >编辑课程</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="course-detail-abt">
                        <div class="course-abt-info"><span class="course-abt-pre">课程名称：</span>{{editCourseForm.name}}</div>
                        <div class="course-abt-info"><span class="course-abt-pre">所属学期：</span>{{editCourseForm.term}}</div>
                        <div class="course-abt-info"><span class="course-abt-pre">所属学院：</span>{{editCourseForm.college}}</div>
                        <div class="course-abt-info"><span class="course-abt-pre">课程状态：</span>
                            <el-tag size="small" v-if="editCourseForm.statu === 1" type="success">正常</el-tag>
                            <el-tag size="small" v-else-if="editCourseForm.statu === 0" type="danger">关闭</el-tag></div>
                    </div>
                    <div class="course-detail-desc">
                        <span class="course-abt-pre">描述：</span><span>{{editCourseForm.description}}</span>
                    </div>
                </el-card>
                <div class="class-page" v-if="courseClassList.length > 0">

                    <div class="c-list">
                        <div class="c-item" v-for="(item,index) in courseClassList" :key="index" @click="routerToClassDetail(item.parentId, item.id)">
                            <img class="cover" :src="item.image" alt="">
                            <div class="item-r">
                                <div>
                                    <div class="title">
                                        {{item.name}}
                                        <el-tag style="margin-left: 2px;" size="mini" v-if="item.statu === 1" type="success">正常</el-tag>
                                        <el-tag  style="margin-left: 2px;" size="mini" v-else-if="item.statu === 0" type="danger">关闭</el-tag></div>
                                    <div class="desc">{{item.description}}</div>
                                </div>
                                <div class="info">
                                    <span><i class="el-icon-s-custom"></i>{{item.page_count}}人</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="courseClassList.length <= 0 && selectCourse == true">

                    <el-empty  description="暂无班级"></el-empty>
                </div>

            </el-col>
        </el-row>

        <!--新增学期-->
        <el-dialog
                title="编辑"
                :visible.sync="editTermDig"
                width="30%">
            <el-form ref="editTermForm" :model="editTermForm" label-width="80px" :rules="editFormRules">
                <el-form-item  label="名称" prop="name">
                    <el-input v-model="editTermForm.name" placeholder="正确格式:[2021-2022-1]"></el-input>
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
            <el-button type="primary" @click="editTermHandler('editTermForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!--创建课程-->
        <el-dialog
                title="编辑"
                :visible.sync="editCourseDig"
                width="50%">
            <el-form ref="editCourseForm" label-position="right" :model="editCourseForm" label-width="80px" :rules="editFormRules">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item label="选择学期" prop="parentId">
                            <el-select v-model="editCourseForm.parentId" placeholder="请选择学期">
                                <template v-for="item in termList">
                                    <el-option :label="item.name" :value="item.id"></el-option>
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
                        <el-form-item label="课程类型" prop="category">
                            <el-select v-model="editCourseForm.category" placeholder="请选择课程类型">
                                <template v-for="item in courseType">
                                    <el-option :label="item.name" :value="item.name"></el-option>
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
                        <el-form-item  label="课程名称" prop="name">
                            <el-input v-model="editCourseForm.name" placeholder="课程名"></el-input>
                        </el-form-item>

                        <el-form-item  label="课程描述"  prop="description">
                            <el-input type="textarea" v-model="editCourseForm.description" placeholder="给课程来一段优美的描述吧"></el-input>
                        </el-form-item>

                        <el-form-item  label="课程图片">
                            <el-input v-model="editCourseForm.image" ></el-input>
                            <el-upload
                                    class="upload-demo"
                                    :action="uploadFile"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :on-exceed="handleExceed"
                                    :on-success="handleUploadSuccess"
                                    :before-remove="beforeRemove"
                                    :file-list="courseImageList"
                                    :limit="1"
                                    name="image"
                                    :data="uploadFileData"
                                    :headers="uploadHeaders"
                                    accept=".jpg,.jpeg,.png"
                                    list-type="picture">
                                <el-button size="small" type="success" ><i class="el-icon-upload"></i>点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item v-if="editCourseForm.imageShow == true">
                            <el-image
                                    style="width: 100px; height: 100px"
                                    :src="editCourseForm.imageUrl"
                                    fit="fill"></el-image>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editCourseDig = false">取 消</el-button>
            <el-button type="primary" @click="editCourseHandler('editCourseForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!--新增学期-->
        <el-dialog
                title="编辑"
                :visible.sync="courseClassDig"
                width="30%">
            <el-form ref="courseClassForm" :model="courseClassForm" label-width="80px" :rules="editFormRules">

                <el-form-item  label="所属学期" prop="term">
                    <el-input v-model="courseClassForm.term" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item  label="所属课程" prop="courseName">
                    <el-input v-model="courseClassForm.courseName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item  label="班级名称" prop="name">
                    <el-input v-model="courseClassForm.name" placeholder="正确格式:[2021-2022-1]"></el-input>
                </el-form-item>
                <el-form-item label="班级状态" prop="statu">
                    <el-radio-group v-model="courseClassForm.statu">
                        <el-radio :label=0>关班</el-radio>
                        <el-radio :label=1>正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序号" prop="orderNum">
                    <el-input-number v-model="courseClassForm.orderNum" :min="1" label="排序号">1</el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="courseClassDig = false">取 消</el-button>
            <el-button type="primary" @click="editCourseClassHandler('courseClassForm')">确 定</el-button>
            </span>
        </el-dialog>

        <DistStudentDig :distDig.sync="distDig" :classId="classId"></DistStudentDig>

    </div>
</template>

<script>
    import DistStudentDig from "./component/DistStudentDig";
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
        components: {DistStudentDig},
        data () {
            return {
                termCourseList: [],
                expandRow: [],

                selectCourse: false,
                courseClassList: [],
                searchForm: {},

                editTermDig: false,
                editTermForm: {},
                editFormRules: {
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ],
                    parentId: [
                        {required: true, message: '请选择学期', trigger: 'blur'}
                    ],
                    collegeId: [
                        {required: true, message: '请选择学院', trigger: 'blur'}
                    ],
                    category: [
                        {required: true, message: '请选择课程类型', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {min: 2, max: 20, message: '长度在2-20之间', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '描述不可为空', trigger: 'blur'},
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
                courseImageList: {},

                uploadFile: this.$MyComm.baseURL + '/file/upload/image',
                uploadFileData: {
                    type: 1,
                    belongId: 1
                },
                uploadHeaders: {
                    Authorization: localStorage.getItem('token')
                },

                courseClassDig: false,
                courseClassForm: {},
                distDig: false,
                classId: 0


            }
        },
        created() {
          var info =  {
              h_cover: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              title: '软件工程教学班1',
              abstract: '本课程介绍编程语言的基本概念，重点介绍函数式编程...',
              page_count: 1,
              view_count: 100
          };
          for(var i = 0; i < 0; i++) {
              this.courseClassList.push(info)
          }
          this.getTermCourseList()
        },
        computed: {
            treeData:function(){
                var searchValue=this.searchForm.value;
                if(searchValue){
                    // 一般表格的查询
                    // return  this.tableData.filter(function(dataNews){
                    //   return Object.keys(dataNews).some(function(key){
                    //     return String(dataNews[key]).toLowerCase().indexOf(search) > -1
                    //   })
                    // })
                    let treeData = this.termCourseList;
                    let handleTreeData = this.handleTreeData(treeData, searchValue)
                    this.setExpandRow(handleTreeData)
                    this.expandRow = this.expandRow.join(",").split(",")
                    return handleTreeData
                }
                return this.termCourseList
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
            //  树形表格过滤
            handleTreeData(treeData, searchValue) {
                if (!treeData || treeData.length === 0) {
                    return [];
                }
                const array = [];
                for (let i = 0; i < treeData.length; i += 1) {
                    let match = false;
                    for(let pro in treeData[i]){
                        if(typeof(treeData[i][pro])=='string'){
                            match |= treeData[i][pro].includes(searchValue);
                            if(match) break;
                        }
                    }
                    if (this.handleTreeData(treeData[i].children, searchValue).length > 0 || match ) {
                        array.push({
                            ...treeData[i],
                            children: this.handleTreeData(treeData[i].children, searchValue),
                        });
                    }
                }
                return array;
            },
            // 将过滤好的树形数据展开
            setExpandRow(handleTreeData) {
                if(handleTreeData.length) {
                    for (let i of handleTreeData) {
                        this.expandRow.push(i.id)
                        if(i.children.length) {
                            this.setExpandRow(i.children)
                        }
                    }
                }
            },
            getTermCourseList() {
                this.$axios.get("/course/getTermCourse").then(res=> {
                    this.termCourseList = res.data.data;
                })
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
            editTermHandler(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        var temp = this.editTermForm.name.split("-");
                        this.editTermForm.parentId = 0;
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
                        this.$axios.post('/course/'+ (this.editTermForm.id ? 'updateTerm': 'addTerm'), this.editTermForm).then(res => {
                            this.$notify({
                                showClose: true,
                                message: '操作成功',
                                type: 'success'
                            });
                            this.editTermDig = false;
                            this.getTermCourseList();
                            this.editTermForm = {}

                        })
                    } else{
                        return false;
                    }
                })
            },
            async editHandle(num, scopeRow) {
                if(num == 0) {
                    this.editTermForm = scopeRow;
                    this.editTermDig = true;
                }
                if(num == 1) {

                    this.getDeptList();
                    this.getTermList();
                    this.editCourseForm =  scopeRow;
                    this.editCourseForm.imageShow = true;
                    this.editCourseForm.imageUrl = this.$MyComm.baseURL + scopeRow.image;
                    this.editCourseDig = true;
                }
                if(num == 2) {
                    this.courseClassForm = scopeRow;

                    const{data: res1} = await this.$axios.get("/course/getCourseById/" + scopeRow.parentId);
                    this.courseClassForm.courseName = res1.data.name;

                    const{data: res2} = await this.$axios.get("/course/getTermById/" + res1.data.parentId);

                    this.courseClassForm.term = res2.data.name;
                    this.courseClassDig = true;
                }
                if(num == 3) {

                    this.editTermDig = true;
                }
                if(num == 4) {
                    this.getTermList();
                    this.getDeptList();

                    this.editCourseDig = true;
                }
                if(num == 5) {
                    this.getDeptList();
                    this.getTermList();
                    this.editCourseForm.parentId = scopeRow.id;
                    this.editCourseDig = true

                }
                if(num == 6) {
                    this.courseClassForm.courseName = scopeRow.name;
                    this.courseClassForm.parentId = scopeRow.id;
                    this.courseClassForm.courseId = scopeRow.courseId;
                    const{data: res} = await this.$axios.get("/course/getTermById/" + scopeRow.parentId);
                    this.courseClassForm.term = res.data.name;
                    this.courseClassDig = true;
                }
                if(num == 7) {
                    this.courseClassForm.courseName = this.editCourseForm.name;
                    this.courseClassForm.parentId = this.editCourseForm.id;
                    this.courseClassForm.courseId = this.editCourseForm.courseId;
                    const{data: res} = await this.$axios.get("/course/getTermById/" + this.editCourseForm.parentId);
                    this.courseClassForm.term = res.data.name;
                    this.courseClassDig = true;
                }if(num == 11) {
                   this.classId = scopeRow.id;
                   this.distDig = true;
                }


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
            },
            handleUploadSuccess(res, file, fileList) {
                if(res.code == 200) {
                    console.log(res)
                    this.editCourseForm.image = res.data.url;
                    this.editCourseForm.imageShow = false;
                }
            },
            editCourseHandler(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        this.$axios.post('/course/' + (this.editCourseForm.id?'updateCourse' : 'addCourse'), this.editCourseForm).then(res => {
                            this.$notify({
                                showClose: true,
                                message: "操作成功",
                                type: 'success'
                            });
                            this.editCourseDig = false;
                            this.editCourseForm = {};
                            this.courseImageList = {};
                            this.getTermCourseList();
                            this.selectCourse = false;
                            this.courseClassList = [];
                        })
                    } else{
                        return false;
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.editCourseDig = false;
                this.editTermDig = false;
                this.editTermForm = {};
                this.editCourseForm ={}
            },
            editCourseClassHandler(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        this.$axios.post('/course/' + (this.courseClassForm.id?'updateCourseClass' : 'addCourseClass'), this.courseClassForm).then(res => {
                            this.$notify({
                                showClose: true,
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.courseClassDig = false;
                            this.courseClassForm = {};
                            this.getTermCourseList();
                        })
                    } else{
                        return false;
                    }
                })
            },
            delHandle(id) {
                this.$axios.post("/course/delete/" + id).then(res => {
                    this.getTermCourseList()
                    if(res.data.code === 200) {
                        this.$notify({
                            showClose: true,
                            message: '删除成功',
                            type: 'success'
                        });
                    }

                })
            },
            rowClickHandler(row,column, event) {
                if(row.type == 1) {
                    this.searchForm.query = '';
                    this.courseHandler(row.id);
                } else if(row.type == 2) {
                    this.searchForm.query = row.name;
                    this.courseHandler(row.parentId)
                } else {
                    this.searchForm.query = '';
                    this.selectCourse = false;
                    this.courseClassList = [];
                }
            },

            async courseHandler(id) {
                const{data: res} = await this.$axios.get("/course/getCourseById/" + id);
                const{data: res1} = await this.$axios.get("/course/getTermById/" + res.data.parentId);
                const{data: res2} = await this.$axios.get("/course/getCourseCollege/" + res.data.collegeId);
                this.editCourseForm = res.data;
                this.editCourseForm.term = res1.data.name;
                this.editCourseForm.college = res2.data.name;
                this.selectCourse = true;
                this.getCourseClassList(this.editCourseForm.id);
            },

            async getCourseClassList(courseId) {
                const{data: res} = await this.$axios.get("/course/getCourseClassList", {
                    params: {
                        courseId: courseId,
                        query: this.searchForm.query
                    }
                });
                this.courseClassList = res.data;
                for(var i = 0; i < this.courseClassList.length; i++) {
                    this.courseClassList[i].image = this.$MyComm.baseURL + this.editCourseForm.image;
                    this.courseClassList[i].description = this.editCourseForm.description;
                }
            },
            routerToClassDetail(courseId, classId) {
                this.$router.push({path:'/course/class/detail',query: {courseId: courseId, classId: classId}})
            }
        }
    }
</script>
<style lang="scss">
    .handle-box {
    }
    .course-detail-info {
        position: relative;
        width: 100%;
        margin-bottom: 10px;
    }
    .course-detail-abt {
        display: flex;
        width: 40%;
        float: left;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: hidden;
        justify-content: space-between;
    }
    .course-abt-info {
        margin-bottom: 5px;
        overflow: hidden;
    }
    .course-abt-pre {
        font-size: 15px;
        font-weight: bold;
        color: #99a9bf;
    }
    .course-detail-desc {
        width: 60%;
        overflow: hidden;
    }

    .class-page {
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