(() => {
  const projectIndex = new URLSearchParams(window.location.search).get("from") || "";
  const projectQuery = projectIndex ? `&project=${encodeURIComponent(projectIndex)}` : "";
  const portfolioFallback = `../../index.html?return=projects${projectQuery}#projects`;

  document.querySelectorAll("[data-case-return]").forEach((link) => {
    link.setAttribute("href", portfolioFallback);
    link.addEventListener("click", () => {
      try {
        window.sessionStorage.setItem("portfolio:return-pending", "1");
      } catch (error) {
        // The fallback URL still restores the projects section without storage.
      }

    });
  });
})();
