function calculateDuration(startTime: number): number {
    const endTime = Date.now();
    return (endTime - startTime) / 1000;
}
  

export { calculateDuration };