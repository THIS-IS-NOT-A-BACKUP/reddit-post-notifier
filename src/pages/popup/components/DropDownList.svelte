<script lang="ts">
    import type { RedditItem, RedditMessage } from '@/reddit-api/reddit-types';
    import ArrowUp from '@assets/arrowhead-up.svg';
    import { flip } from 'svelte/animate';
    import { quadOut } from 'svelte/easing';
    import { slide } from 'svelte/transition';
    import { slideHorizontal } from '../helpers/transition';
    import FloatingPreview from './FloatingPreview.svelte';
    import SvgButton from './SvgButton.svelte';

    export let items: RedditItem[] | RedditMessage[];
    export let rowOutTransition = slideHorizontal;
    export let isExpanded = false; // initial state
    export let toggle: (e: MouseEvent) => void;

    let containerElement: HTMLElement;
</script>

<div class="drop-down-list" data-keys-target="list-container" bind:this={containerElement}>
    <div class="item" tabindex="0" on:click={toggle} data-keys-target="list-row">
        <slot name="header-row" />
        <span class="ml-auto mr-3">
            <SvgButton on:click={toggle}>
                <div class={`transfrom duration-200 ease-out ${isExpanded ? 'rotate-180' : ''}`}>
                    {@html ArrowUp}
                </div>
            </SvgButton>
        </span>
    </div>
    {#if isExpanded}
        <div class="flex flex-row ml-2" transition:slide|local={{ duration: 150, easing: quadOut }}>
            <!-- Vertical Line -->
            <button class="flex w-5 group flex-shrink-0" on:click={toggle}>
                <span class="w-px ml-1 h-full bg-skin-delimiter group-hover:bg-skin-accent2 group-hover:w-[2px]" />
            </button>

            <ul class="flex flex-col flex-grow" data-floatpreview-target="true">
                {#each items as item (item.data.id)}
                    <li
                        class="item"
                        tabindex="0"
                        data-keys-target="post-row"
                        out:rowOutTransition|local={{ duration: 150, id: item.data.id }}
                        animate:flip={{ delay: 100, duration: 100 }}
                    >
                        <slot name="list-row" {item} />
                    </li>
                {/each}
            </ul>
        </div>
        {#if containerElement}
            <FloatingPreview posts={items} {containerElement} />
        {/if}
    {/if}
</div>

<style lang="postcss">
    .drop-down-list {
        @apply flex flex-col w-full min-w-[12rem] max-w-[32rem];
    }

    .item {
        @apply flex items-center w-full my-px
               border-t border-b border-skin-bg
               hover:border-skin-delimiter focus:border-skin-delimiter
               hover:bg-skin-item-hover focus:bg-skin-item-hover
               focus-visible:outline-none focus-visible:border-skin-outline;
    }

    :global([slot='list-row']),
    :global([slot='header-row']) {
        flex-grow: 1;
    }
</style>