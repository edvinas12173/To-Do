<template>
    <div class="container">
        <div class="row">
            <router-view :user_id="id"></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['id'],
    }
</script>

