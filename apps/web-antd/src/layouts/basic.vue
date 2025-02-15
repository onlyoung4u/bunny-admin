<script lang="ts" setup>
import type { NotificationItem } from '@vben/layouts';

import { computed, ref, watch } from 'vue';

import { AuthenticationLoginExpiredModal, useVbenModal } from '@vben/common-ui';
import { useWatermark } from '@vben/hooks';
import { CarbonPassword } from '@vben/icons';
import {
  BasicLayout,
  LockScreen,
  Notification,
  UserDropdown,
} from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import { useAuthStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';
import ResetPassword from '#/views/_core/authentication/reset-password.vue';

const notifications = ref<NotificationItem[]>([
  // {
  //   avatar: 'https://avatar.vercel.sh/vercel.svg?text=VB',
  //   date: '3小时前',
  //   isRead: true,
  //   message: '描述信息描述信息描述信息',
  //   title: '收到了 14 份新周报',
  // },
]);

const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const { destroyWatermark, updateWatermark } = useWatermark();
const showDot = computed(() =>
  notifications.value.some((item) => !item.isRead),
);

const [ResetPasswordModal, resetPasswordModalApi] = useVbenModal({
  connectedComponent: ResetPassword,
});

const menus = computed(() => [
  {
    handler: () => {
      resetPasswordModalApi.open();
    },
    icon: CarbonPassword,
    text: '修改密码',
  },
]);

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

async function handleLogout() {
  await authStore.logout(false);
}

function handleNoticeClear() {
  notifications.value = [];
}

function handleMakeAll() {
  notifications.value.forEach((item) => (item.isRead = true));
}
watch(
  () => preferences.app.watermark,
  async (enable) => {
    if (enable) {
      await updateWatermark({
        content: `${userStore.userInfo?.username}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus
        :text="userStore.userInfo?.nickname"
        :description="userStore.userInfo?.username"
        tag-text="Pro"
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <Notification
        :dot="showDot"
        :notifications="notifications"
        @clear="handleNoticeClear"
        @make-all="handleMakeAll"
      />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
  <ResetPasswordModal />
</template>
