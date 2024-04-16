<template>
    <v-container class="navi-container" fluid>
        <v-expansion-panels v-model="expands" multiple>
            <v-expansion-panel title="最近访问" value="recent">
                <template #text>
                    <v-row>
                        <v-col cols="12" md="6" lg="4" xl="3">
                            <v-card>
                                <v-img src="https://oss.ivan1105.top/gamecovers/1680002856124" height="300" cover />
                                <v-card-title>图库</v-card-title>
                            </v-card>
                        </v-col>
                    </v-row>
                </template>
            </v-expansion-panel>

            <v-expansion-panel title="所有菜单" value="all">
                <template #text>
                    <v-row>
                        <v-col cols="12" md="6" lg="4" xl="3">
                            <v-card>
                                <v-img src="https://oss.ivan1105.top/gamecovers/1680002856124" height="300" cover />
                                <v-card-title>图库</v-card-title>
                            </v-card>
                        </v-col>
                    </v-row>
                </template>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
</template>

<script lang="ts" setup>
const expands = ref(['recent', 'all']);
</script>

<style lang="scss" scoped>
</style>