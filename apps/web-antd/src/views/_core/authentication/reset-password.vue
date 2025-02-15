<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form'

import { computed, reactive } from 'vue'

import { useVbenModal } from '@vben/common-ui'

import { message } from 'ant-design-vue'

import { useVbenForm, z } from '#/adapter/form'
import { resetPasswordApi } from '#/api/core/auth'

defineOptions({ name: 'ResetPassword' })

const [Form, { validate, getValues }] = useVbenForm(
  reactive({
    // commonConfig: {
    //   hideLabel: true,
    //   hideRequiredMark: true,
    // },
    schema: computed((): VbenFormSchema[] => [
      {
        component: 'VbenInputPassword',
        componentProps: {
          placeholder: '请输入旧密码',
        },
        fieldName: 'old_password',
        label: '旧密码',
        rules: z
          .string()
          .min(1, { message: '请输入旧密码' })
          .max(32, { message: '密码长度不能超过16个字符' }),
      },
      {
        component: 'VbenInputPassword',
        componentProps: {
          passwordStrength: true,
          placeholder: '请输入新密码',
        },
        fieldName: 'password',
        label: '新密码',
        renderComponentContent() {
          return {
            strengthText: () => '使用 8 个或更多字符，混合字母、数字和符号',
          }
        },
        rules: z
          .string()
          .min(1, { message: '请输入新密码' })
          .max(32, { message: '密码长度不能超过32个字符' }),
      },
      {
        component: 'VbenInputPassword',
        componentProps: {
          placeholder: '请再次输入新密码',
        },
        dependencies: {
          rules(values) {
            return z
              .string({ message: '请再次输入新密码' })
              .min(1, { message: '请再次输入新密码' })
              .refine((value) => value === values.password, {
                message: '两次输入的密码不一致',
              })
          },
          triggerFields: ['password'],
        },
        fieldName: 'confirm_password',
        label: '确认密码',
      },
    ]),
    showDefaultActions: false,
    layout: 'vertical',
  }),
)

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await validate()
    if (valid) {
      modalApi.lock(true)
      try {
        const values = await getValues()
        await resetPasswordApi(values)
        message.success('修改密码成功')
        modalApi.close()
      } finally {
        modalApi.lock(false)
      }
    }
  },
})
</script>

<template>
  <Modal title="修改密码" class="sm:max-w-[500px]">
    <Form />
  </Modal>
</template>
