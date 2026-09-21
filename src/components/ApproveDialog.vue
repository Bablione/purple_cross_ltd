<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { AlertTriangle, X } from '@lucide/vue'

const props = defineProps<{
  title: string
  description: string
  confirmLabel?: string
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const cancelButton = ref<HTMLButtonElement | null>(null)

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('cancel')
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.classList.add('modal-open')
  cancelButton.value?.focus()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('modal-open')
})
</script>

<template>
  <Teleport to="body">
    <div class="modal d-block" tabindex="-1" @mousedown.self="emit('cancel')">
      <section
        class="modal-dialog modal-dialog-centered"
        role="alertdialog"
      >
        <div class="modal-content shadow">
          <div class="modal-header">
            <h2 id="dialog-title" class="modal-title fs-5 d-flex align-items-center gap-2">
              <AlertTriangle :size="22" class="text-danger" />{{ props.title }}
            </h2>
            <button class="btn-close" type="button" aria-label="Close" @click="emit('cancel')"><X class="d-none" /></button>
          </div>
          <div class="modal-body"><p id="dialog-description" class="mb-0 text-secondary">{{ props.description }}</p></div>
          <div class="modal-footer">
            <button ref="cancelButton" class="btn btn-secondary" type="button" @click="emit('cancel')">Cancel</button>
            <button class="btn btn-danger" type="button" @click="emit('confirm')">{{ props.confirmLabel ?? 'Delete' }}</button>
          </div>
        </div>
      </section>
    </div>
    <div class="modal-backdrop show"></div>
  </Teleport>
</template>