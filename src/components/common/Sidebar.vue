<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#ffd04b"
            :unique-opened="true"
            router
        >
            <template v-for="item in menuList">
                <template v-if="item.children.length > 0">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu
                                v-if="subItem.children"
                                :index="subItem.path"
                                :key="subItem.index"
                            >
                                <template slot="title">
                                    <i :class="subItem.icon"></i>
                                    <span slot="title">{{ subItem.title }}</span>
                                </template>
<!--                                <el-menu-item-->
<!--                                    v-for="(threeItem,i) in subItem.subs"-->
<!--                                    :key="i"-->
<!--                                    :index="threeItem.path"-->
<!--                                >{{ threeItem.title }}</el-menu-item>-->
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.path"
                                :key="subItem.index"
                            ><i :class="subItem.icon"></i>
                                <span slot="title">{{ subItem.title }}</span></el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-if="item.children.length === 0">
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false
        };
    },
    computed: {
        menuList: {
            get() {
                return this.$store.state.menus.menuList
            }
        },
        onRoutes() {
            // console.log(this.$route)
            return this.$route.path;
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
