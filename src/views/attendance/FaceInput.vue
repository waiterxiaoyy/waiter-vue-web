<template>
    <div class="app-contanier">
        <el-card>
            <div>
                <div> <video width="400px" height="400px" ref="video"></video></div>
                <button id="snap" @click="getImg">截取图像</button>
                <div> <canvas width="400px" height="400px" ref="canvas"></canvas></div>
            </div>
        </el-card>

    </div>
</template>

<script>
    export default {
        name: "FaceInput",
        data() {
            return {
                vaido: null,
            };
        },
        created() {
            // this.openCamera()//进入页面摄像头自动加载
        },
        methods:{
            openCamera(){
                this.$nextTick(() => {
                    var video = this.$refs.video;
                    this.video = video;
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        navigator.mediaDevices
                            .getUserMedia({
                                video: true
                            })
                            .then(function(stream) {
                                MediaStreamTrack =
                                    typeof stream.stop === "function"
                                        ? stream
                                        : stream.getTracks()[1];
                                video.srcObject = stream;
                                video.play();
                            })
                            .catch(function(err) {
                                // console.log(err);
                            });
                    } else if (navigator.getMedia) {
                        navigator
                            .getMedia({
                                video: true
                            })
                            .then(function(stream) {
                                console.log(stream);
                                MediaStreamTrack = stream.getTracks()[1];
                                video.src = window.webkitURL.createObjectURL(stream);
                                video.play();
                            })
                            .catch(function(err) {
                                console.log(err);
                            });
                    }
                });
            },

            //canvas中展示截取的图像
            getImg() {
                var canvas = this.$refs.canvas;
                var context = canvas.getContext("2d");
                context.drawImage(this.video, 0, 0, 200, 150);
                var image = canvas.toDataURL("image/png");
                var timestamp = Date.parse(new Date());//获取时间戳，防止图像重名
                var img = this.dataURLtoFile(image, timestamp+".png");//使用png的图像进行名称拼接

                var formData = new FormData();
                formData.append("file",img); //将生成的图像生成file文件对象
                //上传图片的接口与后端进行交互，获取图片
                uploadImg(formData ).then(res => {
                    this.imageUrl = res.data.message.url
                });
            },

            //图片转base64位
            dataURLtoFile(dataurl, filename) {
                var arr = dataurl.split(","),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                var file = new File([u8arr], filename, { type: mime });
                return new File([u8arr], filename, { type: mime });
            },
        }
    }
</script>

<style scoped>

</style>