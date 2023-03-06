<template>
    <transition>
        <div class="placeholder">
            <slot></slot>
            <img src="/icon.svg" class="logo"/>
            <p class="bottom">
                <slot name="bottom"></slot>
            </p>
        </div>
    </transition>
</template>

<style>
.placeholder {
    text-align: center;
    margin: 0 auto;
    opacity: 0.1;
    font-size: 1.8rem;
    padding: 2rem 0;
    transition: all linear 0.5s;
}
.placeholder img.logo {
    display: block;
    margin: 1rem auto 0 auto;
    width: 5rem;
    height: 5rem;
}
.bottom {
    text-align: right;
    font-size: 1rem;
    display: inline-block;
}
.v-enter-from {
    opacity: 0;
}
.v-enter-to {
    opacity: 0.1;
}
</style>