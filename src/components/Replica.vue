<script setup>
import { nextTick, onMounted } from 'vue';

const props = defineProps({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    markup: { type: String, required: true },
    css: { type: String, required: true },
    code: { type: String, default: '' },
});

onMounted(async () => {
    document.title = props.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', props.description);

    const style = document.createElement('style');
    style.textContent = props.css;
    document.head.appendChild(style);

    if (props.code) {
        const script = document.createElement('script');
        script.textContent = props.code;
        document.body.appendChild(script);
    }

    // The markup is rendered after load, so the browser's own jump to #pricing / #faq misses it.
    await nextTick();
    if (location.hash) {
        document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
    }
});
</script>

<template>
    <div v-html="markup" />
</template>
