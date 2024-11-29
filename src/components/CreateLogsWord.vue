<template>
  <div>
  </div>
</template>
<script>
export default {
    name: "CreateLogsWord",
    data() {
        return {
            crateLogs: [], 
        };
    },
    methods: {
        createLog(event, device, userId) {
            const newLog = {
                id: this.crateLogs.length + 1, 
                time: new Date().toISOString(), 
                event: event,
                device: device,
                user: `User${userId}`, 
                description: `User${userId} performed ${event} on ${device}`,
            };
            this.crateLogs.push(newLog);
            this.$emit('logCreated', newLog); 
        }
    }
};
</script>
<style scoped>
</style>
