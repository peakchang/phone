<script>
    import { fade, scale } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { onMount } from "svelte";

    let {
        isOpen = false,
        title = "",
        closeOnOutsideClick = false,
        maxWidth = "500px",
        closeModal,
    } = $props();

    // export let isOpen = false;
    // export let title = "";
    // export let showCloseButton = true;
    // export let closeOnOutsideClick = false;
    // export let maxWidth = "500px";

    // function closeModal() {
    //     isOpen = false;
    // }

    function handleOutsideClick() {
        if (closeOnOutsideClick) {
            closeModal();
        }
    }

    function handleKeydown(e) {
        if (e.key === "Escape" && isOpen) {
            closeModal();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
    <div
        class="modal-backdrop pretendard"
        transition:fade={{ duration: 200 }}
        on:click={handleOutsideClick}
        on:keydown={(e) => e.key === "Enter" && handleOutsideClick()}
        role="button"
        tabindex="0"
    >
        <!-- svelte-ignore a11y_interactive_supports_focus -->
        <div
            class="modal-content"
            style="max-width: {maxWidth}"
            transition:scale={{ duration: 200, easing: quintOut, start: 0.95 }}
            on:click|stopPropagation
            on:keydown|stopPropagation
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
        >
            {#if closeModal}
                <button
                    class="close-button"
                    on:click={closeModal}
                    aria-label="닫기"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            {/if}

            {#if title}
                <h2 id="modal-title" class="modal-title">{title}</h2>
            {/if}

            <div class="modal-body">
                <slot />
            </div>

            {#if $$slots.footer}
                <div class="modal-footer">
                    <slot name="footer" />
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 500;
        padding: 1rem;
    }

    .modal-content {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        position: relative;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        color: #6b7280;
        transition: color 0.2s;
        border-radius: 6px;
    }

    .close-button:hover {
        color: #111827;
        background-color: #f3f4f6;
    }

    .modal-title {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #111827;
        padding-right: 2rem;
    }

    .modal-body {
        color: #374151;
        line-height: 1.6;
    }

    .modal-footer {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
    }
</style>
