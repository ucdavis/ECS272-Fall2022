<template>
    <a-dropdown>
        <template #overlay>
            <a-menu @click="handleMenuClick">
                <a-menu-item key="2019">
                    <UserOutlined />
                    2019
                </a-menu-item>
                <a-menu-item key="2018">
                    <UserOutlined />
                    2018
                </a-menu-item>
                <a-menu-item key="2017">
                    <UserOutlined />
                    2017
                </a-menu-item>
            </a-menu>
        </template>
        <a-button class="bubbleButton">
            {{ year }}
            <DownOutlined />
        </a-button>
    </a-dropdown>
</template>

<script>
export default {
    props: {
        year: Number,
    },
    methods: {
        handleMenuClick(e) {
            console.log('click left button', e);
            this.year = e.key;
            this.processData(e.key).then(() => {
                d3.select('svg').remove();
                this.DrawChart(this.bubbleData);
            });
        },
    },
};
</script>
