export default function enableBtn() {
  const selectCollection = document.getElementById('select-collection');
  const databaseId = document.getElementById('database-id');
  const submitButton = document.querySelector('button[type="submit"]');

  if (selectCollection.value && databaseId.value) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}
