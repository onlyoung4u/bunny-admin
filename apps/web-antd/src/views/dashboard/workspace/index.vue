<script lang="ts" setup>
import { WorkbenchHeader } from '@vben/common-ui'
import { preferences } from '@vben/preferences'
import { useUserStore } from '@vben/stores'

import dayjs from 'dayjs'

const userStore = useUserStore()
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title> 欢迎您, {{ userStore.userInfo?.nickname }}！ </template>
      <template #description>
        今天是 {{ dayjs().format('YYYY年MM月DD日') }}
      </template>
    </WorkbenchHeader>

    <!-- <div class="mt-5 flex flex-col lg:flex-row">
      <div class="mr-4 w-full lg:w-3/5">
        <WorkbenchProject :items="projectItems" title="项目" @click="navTo" />
        <WorkbenchTrends :items="trendItems" class="mt-5" title="最新动态" />
      </div>
      <div class="w-full lg:w-2/5">
        <WorkbenchQuickNav
          :items="quickNavItems"
          class="mt-5 lg:mt-0"
          title="快捷导航"
          @click="navTo"
        />
        <WorkbenchTodo :items="todoItems" class="mt-5" title="待办事项" />
        <AnalysisChartCard class="mt-5" title="访问来源">
          <AnalyticsVisitsSource />
        </AnalysisChartCard>
      </div>
    </div> -->
  </div>
</template>
