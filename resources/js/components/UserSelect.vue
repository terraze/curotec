<template>
  <Dropdown
    v-model="selectedUser"
    :options="userOptions"
    optionLabel="name"
    :placeholder="placeholder"
    class="w-full"
    @change="handleUserChange"
  >
    <template #value="slotProps">
      <div v-if="slotProps.value">
        {{ slotProps.value.name }}
      </div>
      <span v-else>{{ placeholder }}</span>
    </template>
    <template #option="slotProps">
      {{ slotProps.option.name }}
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { User } from '@/types/user';

const props = defineProps<{
  modelValue?: number | null;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
  (e: 'change', value: number | null): void;
}>();

const userStore = useUserStore();

const selectedUser = computed({
  get() {
    if (!props.modelValue) {
      return { id: null, name: 'Unassigned' };
    }
    return userStore.users.find(user => user.id === props.modelValue) || null;
  },
  set(value: User | null) {
    emit('update:modelValue', value?.id || null);
  }
});

const userOptions = computed(() => [
  { id: null, name: 'Unassigned' },
  ...userStore.users
]);

const handleUserChange = (event: { value: User | null }) => {
  emit('change', event.value?.id || null);
};

onMounted(async () => {
  if (!userStore.loaded) {
    await userStore.fetchUsers();
  }
});
</script> 