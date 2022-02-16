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
                    action="https://jsonplaceholder.typicode.com/posts/"
                    multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传excel文件，且不超过500kb</div>
            </el-upload>

            <el-button @click="tableDrawer = true"></el-button>
        </el-card>

        <TableDrawer :tableDrawer.sync="tableDrawer"></TableDrawer>
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
                uploadDrawer: false,
                optionProps: {
                    value: 'id',
                    label: 'label',
                    children: 'children'
                },// 格式化工单信息
                casData: [],
                casSelectData: [],

                tableDrawer: false
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
                console.log(value);
            },
            getClassTree() {
                this.$axios.get("/mem/stu/getcctree").then(res => {
                    console.log(res.data.data)
                    this.casData = this.getTreeData(res.data.data)
                })
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