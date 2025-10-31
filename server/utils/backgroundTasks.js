export const runInBackground = (fn) => {
    const asyncRunner = typeof setImmediate === 'function' ? setImmediate : setTimeout;
    
    Promise.resolve()
        .then(() => {
            asyncRunner(async () => {
                try {
                    await fn();
                } catch (error) {
                    console.error('Background task failed:', error);
                }
            });
        })
        .catch(console.error);
};
