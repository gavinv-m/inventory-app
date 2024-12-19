export default function clear() {
  const dropdownContainer = document.getElementById('movie-dropdown-container');
  while (dropdownContainer.firstChild) {
    dropdownContainer.removeChild(dropdownContainer.firstChild);
  }
}
