<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-100">
        <Card class="w-full max-w-md">
            <template #title>
                <h2 class="text-center text-2xl font-bold">Sign in to your account</h2>
            </template>
            <template #content>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div class="field">
                        <label for="email" class="block text-sm font-medium">Email</label>
                        <InputText 
                            id="email"
                            v-model="email"
                            type="email"
                            class="w-full"
                            required
                        />
                    </div>
                    <div class="field">
                        <label for="password" class="block text-sm font-medium">Password</label>
                        <Password
                            id="password"
                            v-model="password"
                            :feedback="false"
                            toggleMask
                            class="w-full"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        label="Sign in"
                        class="w-full"
                    />
                </form>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Password from 'primevue/password';

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const email = ref('');
const password = ref('');

const handleSubmit = async () => {
    const success = await auth.login(email.value, password.value);
    if (success) {
        toast.add({ severity: 'success', summary: 'Success', detail: 'Logged in successfully', life: 3000 });
        router.push('/boards');
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid credentials', life: 3000 });
    }
};
</script> 