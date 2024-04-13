<template>
    <div class="navi-container">
        <div class="selector">
            <v-responsive class="ring-container" content-class="ring" aspect-ratio="1" width="70%">
                <div></div>
            </v-responsive>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.navi-container {
    height: 100%;
    position: relative;
    overflow: hidden;
    background-image: url(https://oss.ivan1105.top/static/view-1.jpg);
    background-size: cover;

    .selector {
        position: absolute;
        bottom: 0;
        width: 100%;
        // display: flex;

        // justify-content: center;
        // align-items: center;

        .ring-container {
            position: relative;
            margin: auto;
            transform: translateY(80%);
        }

        :deep(.ring) {
            background-color: skyblue;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;

            // clip-path: polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%);
            &::after {
                content: "";
                width: 80%;
                height: 80%;
                border-radius: 50%;
                background-color: #fff;
            }
        }
    }
}
</style>·