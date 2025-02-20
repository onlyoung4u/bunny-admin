<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table'

import { EllipsisText, Page } from '@vben/common-ui'

import { Tag } from 'ant-design-vue'

import { useVbenVxeGrid } from '#/adapter/vxe-table'
import { logApi } from '#/api/system/log'

const gridOptions: VxeGridProps = {
  columns: [
    { field: 'id', title: 'ID', width: 100 },
    { title: '操作人', slots: { default: 'operator' } },
    { field: 'route', title: '操作' },
    { field: 'method', title: '请求类型', slots: { default: 'method' } },
    { field: 'ip', title: 'IP' },
    { field: 'created_at', title: '操作时间' },
    { field: 'is_success', title: '状态', slots: { default: 'status' } },
    {
      field: 'content',
      title: '请求参数',
      width: 200,
      slots: { default: 'content' },
    },
  ],
  exportConfig: {},
  height: 'auto',
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await logApi.list({
          page: page.currentPage,
          limit: page.pageSize,
        })
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: { code: 'query' },
    zoom: true,
  },
}

const [Grid] = useVbenVxeGrid({
  gridOptions,
})

const methodColorMap: Record<string, string> = {
  POST: '#108ee9',
  PUT: '#87d068',
  DELETE: '#f50',
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="操作日志">
      <template #operator="{ row }">
        <span v-if="row.user_id">{{ row.nickname }} / {{ row.user_id }}</span>
        <span v-else>未登录</span>
      </template>
      <template #method="{ row }">
        <Tag :color="methodColorMap[row.method] || 'default'">
          {{ row.method }}
        </Tag>
      </template>
      <template #status="{ row }">
        <Tag v-if="row.is_success" color="success">成功</Tag>
        <Tag v-else color="error">失败</Tag>
      </template>
      <template #content="{ row }">
        <EllipsisText :line="1">{{ row.content }}</EllipsisText>
      </template>
    </Grid>
  </Page>
</template>
