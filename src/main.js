(async () => {
  try {
    await import("../backend/src/main.js");
  } catch (error) {
    console.error("FATAL ERROR (root entrypoint):", error);
    process.exit(1);
  }
})();
