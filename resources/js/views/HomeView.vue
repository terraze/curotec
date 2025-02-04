<script setup lang="ts">
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <Card class="surface-card">
      <template #title>
        <h1 class="text-3xl font-bold text-900">
          Collaborative Kanban Board
        </h1>
      </template>
      <template #content>
        <div class="space-y-6">
          <p class="text-lg text-700">            
            <a 
              href="https://talent.curotec.com/candidate/assessment/171" 
              target="_blank" 
              rel="noopener noreferrer"
              class="ml-1 inline-flex items-center text-primary hover:text-primary-600"
            >
                Assessment by Jose Ricardo Junior for Curotec <i class="mdi mdi-open-in-new text-sm"></i>
            </a>
          </p>

          <Divider />

          <div class="surface-ground p-6 rounded-lg">
            <h2 class="text-xl font-semibold text-800 mb-4">Info</h2>
            <ul class="space-y-4">
              <li class="flex items-start">
                <i class="mdi mdi-chevron-right text-primary mt-1"></i>
                <span class="ml-2">
                  <strong class="text-primary">Boards</strong> page contains the list of boards. There you can create, edit and delete boards.
                </span>
              </li>
              <li class="flex items-start">
                <i class="mdi mdi-chevron-right text-primary mt-1"></i>
                <span class="ml-2">
                  By clicking on <strong class="text-primary">View Board</strong> you'll be able to see the board and manage its tasks.
                </span>
              </li>
            </ul>
          </div>          
        </div>
        <Button label="View Boards" class="mt-4" />
      </template>
    </Card>
  </div>
</template> 