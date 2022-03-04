<template>
    <div class="container">
        <el-row>
            <el-col span="10">

            </el-col>
            <el-col span="14">
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
    </div>
</template>

<script>
    export default {
        name: "CourseManage",
        data () {
            return {
                init: true,
                list: []
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
        methods: {}
    }
</script>
<style>
    .courses-page {
        position: relative;
        width: 100%;
    }
    .c-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
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

</style>