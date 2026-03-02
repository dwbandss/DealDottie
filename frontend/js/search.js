const input = document.querySelector(".search-inline input");

input.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;

  const q = input.value.trim();
  if (isEmpty(q)) return;

  localStorage.setItem("searchQuery", q);
  window.location.href = "results.html";
});
