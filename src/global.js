import Vue from 'vue';

let MyComm = new Vue({
   data() {
       return {
           baseURL: 'http://localhost:8081',

           toolbarOptions: [
               ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
               ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
               // [{ header: 2 }, { header: 3}], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
               [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
               [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
               [{ indent: "-1" }, { indent: "+1" }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
               [{ direction: "rtl" }], // 文本方向-----[{'direction': 'rtl'}]
               [{ size: ["small", false, "large", "huge"] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
               [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
               [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
               [{ font: [] }], // 字体种类-----[{ font: [] }]
               [{ align: [] }], // 对齐方式-----[{ align: [] }]
               ["clean"], // 清除文本格式-----['clean']
               ["image"] // 链接、图片、视频-----['link', 'image', 'video']
           ]
       }
   },
    methods: {
        hasRole(perm) {
            var authority = this.$store.state.menus.permList;
            console.log(authority)
            return authority.indexOf(perm) > -1
        },
        hasAuthority(perm) {
            var authority = this.$store.state.menus.permList

            return authority.indexOf(perm) > -1
        },

    }
})


export default MyComm;