const $studies = document.querySelectorAll(".case-study");
if ($studies.length) {
  const study = $studies[Math.floor(Math.random() * $studies.length)];
  const $studiesContainer = document.querySelector(".studies-container");
  if ($studiesContainer) {
    $studiesContainer.appendChild(study);
  }
}
