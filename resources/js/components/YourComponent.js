mounted() {
    window.Echo.channel('tasks')
        .listen('TaskUpdated', (e) => {
            // Handle the update here
            console.log('Task updated:', e.task);
            // Update your component's state
        });
} 