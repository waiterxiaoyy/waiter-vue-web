<template>
    <div class="app-container">
        <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
        <el-table
                :data="treeTable"
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                border
                :expand-row-keys="expandRow"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
                    prop="date"
                    label="日期"
                    sortable
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    sortable
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地址">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                search: '',
                expandRow: [],
                tableData: [{
                    id: 1,
                    date: '2016-05-02',
                    name: '王小虎1',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    id: 2,
                    date: '2016-05-04',
                    name: '王小虎2',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    id: 3,
                    date: '2016-05-01',
                    name: '王小虎3',
                    address: '上海市普陀区金沙江路 1519 弄',
                    children: [{
                        id: 31,
                        date: '2016-05-01',
                        name: '王小虎4',
                        address: '上海市普陀区金沙江路 1519 弄'
                    }, {
                        id: 32,
                        date: '2016-05-01',
                        name: '张三',
                        address: '上海市普陀区金沙江路 1519 弄'
                    }]
                }, {
                    id: 4,
                    date: '2016-05-03',
                    name: '李二蛋',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
            }
        },
        computed:{
            treeTable:function(){
                var searchValue=this.search;
                if(searchValue){
                    // 一般表格的查询
                    // return  this.tableData.filter(function(dataNews){
                    //   return Object.keys(dataNews).some(function(key){
                    //     return String(dataNews[key]).toLowerCase().indexOf(search) > -1
                    //   })
                    // })
                    let treeData = this.tableData
                    let handleTreeData = this.handleTreeData(treeData, searchValue)
                    this.setExpandRow(handleTreeData)
                    this.expandRow = this.expandRow.join(",").split(",")
                    return handleTreeData
                }
                return this.tableData
            }
        },
        created() {
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
            }
        }
    }
</script>

<style scoped>
</style>
